"use client";
import { useQueryClient } from "@tanstack/react-query";
import { forwardRef, useState } from "react";
import type { ComponentProps, FC, MouseEventHandler } from "react";
import { erc20Abi, formatUnits } from "viem";
import type { Address } from "viem";
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWatchBlocks,
  useWriteContract,
} from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

import { web3Config } from "@promo-shock/configs/web3";
import type { Button } from "@promo-shock/ui-kit";

type Props<T extends ComponentProps<typeof Button>> = {
  tokenAddress?: Address;
  tokenAmount?: bigint;
  recipientAddress?: Address;
} & T;

const withApprove = <T extends ComponentProps<typeof Button>>(
  Component: FC<T>,
) => {
  return forwardRef<HTMLButtonElement, Props<T>>(
    function WithApprove(props, ref) {
      const [pending, setPending] = useState(false);
      const queryClient = useQueryClient();
      const account = useAccount();
      const contract = useWriteContract();
      const tokenAllowance = useReadContract({
        abi: erc20Abi,
        address: props.tokenAddress,
        functionName: "allowance",
        args: account.address &&
          props.recipientAddress && [account.address, props.recipientAddress],
        chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
      });
      const tokenInfo = useReadContracts({
        query: { staleTime: Infinity },
        contracts: [
          {
            abi: erc20Abi,
            address: props.tokenAddress,
            functionName: "symbol",
            chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
          },
          {
            abi: erc20Abi,
            address: props.tokenAddress,
            functionName: "decimals",
            chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
          },
        ],
      });

      useWatchBlocks({
        blockTag: "latest",
        chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
        onBlock: () => {
          queryClient.invalidateQueries({ queryKey: tokenAllowance.queryKey });
        },
      });

      const handleApprove: MouseEventHandler<HTMLButtonElement> = async (e) => {
        if (isInsufficientAllowance) {
          try {
            setPending(true);
            const hash = await contract.writeContractAsync({
              abi: erc20Abi,
              // @ts-expect-error - TS doesn't know that `tokenAddress` is defined
              address: props.tokenAddress,
              functionName: "approve",
              // @ts-expect-error - TS doesn't know that `recipientAddress` and `amountToApprove` are defined
              args: [props.recipientAddress, props.tokenAmount],
              chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
            });
            await waitForTransactionReceipt(web3Config, { hash });
            await queryClient.invalidateQueries({
              queryKey: tokenAllowance.queryKey,
            });
          } catch (e) {
            // TODO :: handle error
            console.error(e);
          } finally {
            setPending(false);
          }
        } else {
          props.onClick?.(e);
        }
      };

      const [tokenSymbol, tokenDecimals] = tokenInfo.data || [];
      const amountToApproveString =
        typeof props.tokenAmount !== "undefined" &&
        typeof tokenDecimals?.result !== "undefined" &&
        typeof tokenSymbol?.result !== "undefined"
          ? `${formatUnits(props.tokenAmount, tokenDecimals.result)} ${
              tokenSymbol.result
            }`
          : undefined;
      const disabled = !account.address || props.disabled;
      const loading =
        (props.loading ||
          tokenInfo.isLoading ||
          tokenAllowance.isLoading ||
          pending) &&
        !disabled;
      const isInsufficientAllowance =
        typeof props.tokenAmount !== "undefined" &&
        typeof tokenAllowance.data !== "undefined" &&
        !loading &&
        !disabled
          ? tokenAllowance.data < props.tokenAmount
          : undefined;

      return (
        <Component
          {...props}
          ref={ref}
          type={isInsufficientAllowance ? "button" : props.type}
          loading={loading}
          text={
            loading
              ? "Blockchain magic happening"
              : isInsufficientAllowance
              ? `Approve ${amountToApproveString}`
              : props.text
          }
          disabled={disabled}
          onClick={handleApprove}
        />
      );
    },
  );
};

export { withApprove };
