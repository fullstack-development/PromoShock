"use client";
import { useQueryClient } from "@tanstack/react-query";
import { forwardRef } from "react";
import type { ComponentProps, FC } from "react";
import type { Address } from "viem";
import { erc20Abi, formatUnits } from "viem";
import {
  useAccount,
  useBalance,
  useEstimateFeesPerGas,
  useReadContract,
  useReadContracts,
  useWatchBlocks,
} from "wagmi";

import type { Button } from "@promo-shock/ui-kit";

import classes from "./tx-button.module.scss";

type Props<T extends ComponentProps<typeof Button>> = {
  tokenAddress?: Address;
  tokenAmount?: bigint;
  estimatedGas?: bigint;
} & T;

const withBalanceCheck = <T extends ComponentProps<typeof Button>>(
  Component: FC<T>,
) => {
  return forwardRef<HTMLButtonElement, Props<T>>(
    function WithBalanceCheck(props, ref) {
      const queryClient = useQueryClient();
      const estimatedGasFee = useEstimateFeesPerGas();
      const account = useAccount();
      const balance = useBalance({ address: account.address });
      const tokenBalance = useReadContract({
        abi: erc20Abi,
        address: props.tokenAddress,
        functionName: "balanceOf",
        args: account.address && [account.address],
      });
      const tokenInfo = useReadContracts({
        query: { staleTime: Infinity },
        contracts: [
          {
            abi: erc20Abi,
            address: props.tokenAddress,
            functionName: "symbol",
          },
          {
            abi: erc20Abi,
            address: props.tokenAddress,
            functionName: "decimals",
          },
        ],
      });

      useWatchBlocks({
        blockTag: "latest",
        chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
        onBlock() {
          queryClient.invalidateQueries({
            queryKey: tokenBalance.queryKey,
          });
          queryClient.invalidateQueries({
            queryKey: balance.queryKey,
          });
        },
      });

      const [tokenSymbol, tokenDecimals] = tokenInfo.data || [];
      const gasCost =
        typeof estimatedGasFee.data?.maxFeePerGas !== "undefined" &&
        typeof props.estimatedGas !== "undefined"
          ? estimatedGasFee.data.maxFeePerGas * props.estimatedGas
          : undefined;
      const isZeroBalance =
        typeof balance.data?.value !== "undefined"
          ? balance.data.value === BigInt(0)
          : undefined;
      const isZeroTokenBalance =
        typeof tokenBalance?.data !== "undefined"
          ? tokenBalance.data === BigInt(0)
          : undefined;
      const isInsufficientBalance =
        typeof isZeroBalance !== "undefined" &&
        typeof balance.data?.value !== "undefined" &&
        typeof gasCost !== "undefined"
          ? isZeroBalance || gasCost > balance.data.value
          : undefined;
      const isInsufficientTokenBalance =
        typeof isZeroTokenBalance !== "undefined" &&
        typeof tokenBalance?.data !== "undefined" &&
        typeof props.tokenAmount !== "undefined"
          ? isZeroTokenBalance || props.tokenAmount > tokenBalance.data
          : undefined;
      const tokenAmountString =
        typeof props.tokenAmount !== "undefined" &&
        typeof tokenDecimals?.result !== "undefined" &&
        typeof tokenSymbol?.result !== "undefined"
          ? `${formatUnits(props.tokenAmount, tokenDecimals.result)} ${
              tokenSymbol.result
            }`
          : undefined;
      const disabled = props.disabled || !account.address;
      const loading =
        (props.loading ||
          tokenBalance.isLoading ||
          tokenInfo.isLoading ||
          balance.isLoading) &&
        !disabled;
      const error =
        (props.error || isInsufficientTokenBalance || isInsufficientBalance) &&
        !disabled &&
        !loading;

      return (
        <div className={classes.error_wrap}>
          <Component
            {...props}
            ref={ref}
            loading={loading}
            text={loading ? "Blockchain magic happening" : props.text}
            disabled={disabled}
            error={error}
          />

          {error && (
            <span className={classes.error_message}>
              {isInsufficientBalance
                ? "You need some BNB in your wallet to send a transaction."
                : isInsufficientTokenBalance
                ? `You need ${tokenAmountString} in your wallet to send a transaction.`
                : ""}
              <br />
              {process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? (
                <>
                  You can grab some{" "}
                  <a
                    href="https://www.bnbchain.org/en/testnet-faucet"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    here
                  </a>
                </>
              ) : (
                ""
              )}
            </span>
          )}
        </div>
      );
    },
  );
};

export { withBalanceCheck };
