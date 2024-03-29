"use client";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import type { FC } from "react";
import { useHover } from "react-use";
import {
  BaseError,
  InsufficientFundsError,
  UserRejectedRequestError,
  formatUnits,
} from "viem";
import { useAccount } from "wagmi";

import {
  useReadTicketBalanceOf,
  useWriteTicketSaleBuy,
} from "@generated/wagmi";

import {
  withApprove,
  withBalanceCheck,
  withConnect,
  withSwitchNetwork,
} from "@promo-shock/components";
import {
  useErrorMessage,
  useSuccessMessage,
  useWarningMessage,
} from "@promo-shock/services";
import type { Stream as StreamType } from "@promo-shock/shared/entities";
import { fetchStreamCard, fetchPromoCards } from "@promo-shock/shared/queries";
import type { InferQueryKey } from "@promo-shock/shared/types";
import { Button, PromoCard, CopyToClipboard } from "@promo-shock/ui-kit";

import styles from "./stream.module.scss";

type Props = {
  queryKey: InferQueryKey<typeof fetchStreamCard>;
  promosQueryKey: InferQueryKey<typeof fetchPromoCards>;
  paymentTokenSymbol: string;
  paymentTokenDecimals: number;
};

const TxButton = withApprove(
  withBalanceCheck(withSwitchNetwork(withConnect(Button))),
);

export const Stream: FC<Props> = ({
  queryKey,
  promosQueryKey,
  paymentTokenSymbol,
  paymentTokenDecimals,
}) => {
  const stream = useQuery({
    queryKey,
    queryFn: fetchStreamCard,
    placeholderData: keepPreviousData,
  });
  const promos = useQuery({
    queryKey: promosQueryKey,
    queryFn: fetchPromoCards,
    placeholderData: keepPreviousData,
  });
  const {
    name,
    startDate: startDateUnix,
    endDate: endDateUnix,
    description,
    saleAddress,
    ticketAddress,
    paymentTokenAddress,
    saleEndDate: saleEndDateUnix,
    saleStartDate: saleStartDateUnix,
    streamerLink,
    streamLink,
    banner,
    price,
    totalAmount,
    reservedAmount,
  } = stream.data as StreamType;
  const showErrorMessage = useErrorMessage();
  const showSuccessMessage = useSuccessMessage();
  const showWarningMessage = useWarningMessage();
  const [imageElement] = useHover((hovered) => (
    <div className={styles.image_wrap}>
      <div
        className={cn(styles.copy, {
          [styles.copy_hovered]: hovered,
        })}
      >
        <CopyToClipboard text={ticketAddress} message="Copy ticket address" />
      </div>

      <Image
        className={styles.image}
        fill
        sizes="50vw"
        src={banner}
        alt="stream preview"
      />
    </div>
  ));
  const buy = useWriteTicketSaleBuy();
  const [pending, setPending] = useState(false);
  const [bought, setBought] = useState(false);
  const queryClient = useQueryClient();
  const account = useAccount();
  const accountTicketBalance = useReadTicketBalanceOf({
    address: ticketAddress,
    args: account.address && [account.address],
  });

  const now = dayjs.utc();
  const startDate = dayjs.utc(startDateUnix);
  const endDate = dayjs.utc(endDateUnix);
  const saleEndDate = dayjs.utc(saleEndDateUnix);
  const saleStartDate = dayjs.utc(saleStartDateUnix);
  const remainingAmount = totalAmount - reservedAmount;
  const ticketsAreOut = remainingAmount === 0 && startDate.isAfter(now);
  const saleHasFinished = saleEndDate.isBefore(now);
  const saleHasNotStarted = saleStartDate.isAfter(now);
  const streamHasFinished = endDate.isBefore(now);
  const ongoing = startDate.isBefore(now) && endDate.isAfter(now);

  const handleBuy = async () => {
    try {
      setPending(true);
      await buy.writeContractAsync({
        address: saleAddress,
        chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
      });
      queryClient.setQueryData(queryKey, (prev: StreamType) => ({
        ...prev,
        reservedAmount: prev.reservedAmount + 1,
        purchased: true,
      }));
      setBought(true);
      showSuccessMessage(
        "Congratulations! You've successfully secured your ticket!",
      );
    } catch (e) {
      console.error(e);
      if (e instanceof BaseError) {
        if (e.walk((err) => err instanceof UserRejectedRequestError)) {
          showWarningMessage("You've rejected the request :(");
        } else if (e.walk((e) => e instanceof InsufficientFundsError)) {
          showErrorMessage("Insufficient funds to cover the gas fee");
        } else {
          showErrorMessage(
            "Oops! Something went wrong while trying to buy a ticket. Please try again later.",
          );
        }
      }
    } finally {
      setPending(false);
    }
  };

  const purchased =
    (!!accountTicketBalance.data && accountTicketBalance.data !== BigInt(0)) ||
    bought;
  const disabled =
    saleHasFinished || saleHasNotStarted || ticketsAreOut || purchased;
  const loading = accountTicketBalance.isLoading && !disabled;

  return (
    <main className={styles.root}>
      <h1 className={styles.title}>{name}</h1>

      <Button
        className={styles.watchLink}
        theme="quaternary"
        size="big"
        text="Watch stream"
        disabled={!ongoing || !purchased}
        href={ongoing ? streamLink : undefined}
      />

      <div className={styles.streamInfoWrapper}>
        <div className={styles.streamInfo}>
          {imageElement}
          <div className={styles.row}>
            <span className={styles.streamStartLabel}>
              <div className={styles.streamStarts}>Stream starts</div>
              <span className={styles.subtitle}>
                {startDate.format("DD.MM.YY, HH:MM")} —{" "}
                {endDate.format("HH:MM")}
              </span>
            </span>

            {remainingAmount > 0 && startDate.isAfter(now) && (
              <span className={styles.subtitle}>
                {remainingAmount < 5 ? (
                  <span className={styles.fire}>🔥</span>
                ) : (
                  ""
                )}
                {remainingAmount} of {totalAmount} tickets left
              </span>
            )}

            {ticketsAreOut && (
              <span className={cn(styles.subtitle, styles.error)}>
                💔 No tickets left
              </span>
            )}

            {streamHasFinished && (
              <span className={cn(styles.subtitle, styles.error)}>
                🚫 Stream has finished
              </span>
            )}
          </div>

          <TxButton
            size="large"
            theme="secondary"
            type="button"
            text={
              purchased
                ? "You already have access"
                : `Pay ${formatUnits(
                    BigInt(price),
                    paymentTokenDecimals,
                  )} ${paymentTokenSymbol} and buy access`
            }
            loading={loading || pending}
            tokenAddress={paymentTokenAddress}
            tokenAmount={BigInt(price)}
            recipientAddress={saleAddress}
            disabled={disabled}
            onClick={handleBuy}
          />
          <span className={styles.sale_period}>
            Selling period: {saleStartDate.format("DD.MM.YY, HH:mm")} —{" "}
            {saleEndDate.format("DD.MM.YY, HH:mm")}
            {saleHasFinished && <> is over now</>}
            {saleHasNotStarted && <>. Stay tuned!</>}
          </span>
        </div>

        <div className={styles.description}>
          {description}
          <Button
            theme="tertiary"
            size="medium"
            text="Follow streamer"
            href={streamerLink}
          />
        </div>
      </div>

      {(promos.data?.length || 0) > 0 && <h3 className={styles.h3}>Promos</h3>}

      <div className={styles.promoList}>
        {promos.data?.map((promo) => (
          <PromoCard key={promo.tokenId + promo.promoAddress} {...promo} />
        ))}
      </div>
    </main>
  );
};
