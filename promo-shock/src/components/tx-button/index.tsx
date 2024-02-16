import type { ComponentProps, FC, MouseEventHandler } from "react";
import { erc20Abi, formatUnits } from "viem";
import type { Address } from "viem";
import {
  useAccount,
  useBalance,
  useEstimateFeesPerGas,
  useReadContracts,
  useWatchBlocks,
  useWriteContract,
} from "wagmi";

import { useIsMounted } from "@promo-shock/shared/hooks";
import { Button } from "@promo-shock/ui-kit";

import classes from "./tx-button.module.scss";

type Props = {
  tokenAddress?: Address;
  tokenAmount?: bigint;
  recipientAddress?: Address;
  estimatedGas?: bigint;
  onClick?(allowance?: bigint): Promise<void>;
} & Omit<ComponentProps<typeof Button>, "size" | "theme" | "error" | "onClick">;

const TxButton: FC<Props> = ({
  tokenAddress,
  tokenAmount,
  recipientAddress,
  estimatedGas,
  onClick,
  text,
  loading,
  type,
  ...rest
}) => {
  const estimatedGasFee = useEstimateFeesPerGas();
  const isMounted = useIsMounted();
  const account = useAccount();
  const balance = useBalance({ address: account.address });
  const contract = useWriteContract();
  const tokenInfo = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: tokenAddress,
        functionName: "symbol",
      },
      {
        abi: erc20Abi,
        address: tokenAddress,
        functionName: "decimals",
      },
      {
        abi: erc20Abi,
        address: tokenAddress,
        functionName: "balanceOf",
        args: account.address && [account.address],
      },
      {
        abi: erc20Abi,
        address: tokenAddress,
        functionName: "allowance",
        args: account.address &&
          recipientAddress && [account.address, recipientAddress],
      },
    ],
  });

  useWatchBlocks({
    onBlock: () => balance.refetch(),
  });

  const [tokenSymbol, tokenDecimals, tokenBalance, tokenAllowance] =
    tokenInfo.data || [];
  const gasCost =
    typeof estimatedGasFee.data?.maxFeePerGas !== "undefined" &&
    typeof estimatedGas !== "undefined"
      ? estimatedGasFee.data.maxFeePerGas * estimatedGas
      : undefined;
  const isInsufficientAllowance =
    typeof tokenAddress !== "undefined" &&
    typeof recipientAddress !== "undefined" &&
    typeof tokenSymbol?.result !== "undefined" &&
    typeof tokenDecimals?.result !== "undefined" &&
    typeof tokenAmount !== "undefined" &&
    typeof tokenAllowance?.result !== "undefined"
      ? tokenAmount > tokenAllowance.result
      : undefined;
  const isInsufficientTokenBalance =
    typeof tokenAmount !== "undefined" &&
    typeof tokenBalance?.result !== "undefined"
      ? tokenAmount > tokenBalance.result
      : undefined;

  const isInsufficientBalance =
    typeof gasCost !== "undefined" &&
    typeof balance.data?.value !== "undefined" &&
    (gasCost > balance.data.value || balance.data.value === BigInt(0));

  const handleClick: MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      if (isInsufficientAllowance) {
        await contract.writeContractAsync({
          abi: erc20Abi,
          address: tokenAddress!,
          functionName: "approve",
          args: [recipientAddress!, tokenAmount!],
        });
      }
      await onClick?.();
    } catch (error) {}
  };

  if (!(account.address && isMounted)) return null;

  return (
    <div className={classes.error_wrap}>
      <Button
        {...rest}
        type={isInsufficientAllowance ? "button" : type}
        loading={
          (loading || tokenInfo.isLoading || contract.isPending) &&
          !(isInsufficientBalance || isInsufficientTokenBalance)
        }
        text={
          loading && !(isInsufficientBalance || isInsufficientTokenBalance)
            ? "Blockchain magic happening"
            : isInsufficientAllowance
            ? `Approve ${formatUnits(
                tokenAmount!,
                tokenDecimals!.result!,
              )} ${tokenSymbol?.result}`
            : text
        }
        size="large"
        theme="secondary"
        onClick={handleClick}
        error={isInsufficientBalance || isInsufficientTokenBalance}
      />
      {(isInsufficientBalance || isInsufficientTokenBalance) && (
        <span className={classes.error_message}>
          {isInsufficientBalance
            ? "You need some BNB in your wallet to send a transaction."
            : isInsufficientTokenBalance
            ? `You need some ${tokenSymbol?.result} in your wallet to send a transaction.`
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
};

export { TxButton };
