"use client";
import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import type { ComponentProps, FC } from "react";
import { useHover } from "react-use";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";

import {
  useReadTicketBalanceOf,
  useWriteTicketSaleBuy,
} from "@generated/wagmi";

import {
  withApprove,
  withBalanceCheck,
  withSwitchNetwork,
} from "@promo-shock/components";
import type { Stream as StreamType } from "@promo-shock/shared/entities";
import { Button, PromoCard, CopyToClipboard } from "@promo-shock/ui-kit";

import styles from "./stream.module.scss";

type Props = Omit<StreamType, "purchased"> & {
  paymentTokenSymbol: string;
  paymentTokenDecimals: number;
  promos: Array<ComponentProps<typeof PromoCard>>;
};

const TxButton = withApprove(withBalanceCheck(withSwitchNetwork(Button)));

export const Stream: FC<Props> = ({
  name,
  startDate: startDateUnix,
  endDate: endDateUnix,
  description,
  saleAddress,
  ticketAddress,
  paymentTokenAddress,
  paymentTokenSymbol,
  paymentTokenDecimals,
  saleEndDate: saleEndDateUnix,
  saleStartDate: saleStartDateUnix,
  streamerLink,
  streamLink,
  banner,
  price,
  totalAmount,
  reservedAmount,
  promos,
}) => {
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
  const account = useAccount();
  const accountTicketBalance = useReadTicketBalanceOf({
    address: ticketAddress,
    args: account.address && [account.address],
  });

  const startDate = dayjs(startDateUnix);
  const endDate = dayjs(endDateUnix);
  const saleEndDate = dayjs(saleEndDateUnix);
  const saleStartDate = dayjs(saleStartDateUnix);
  const remainingAmount = totalAmount - reservedAmount;
  const ticketsAreOut = remainingAmount === 0 && startDate.isAfter(dayjs());
  const saleHasFinished = saleEndDate.isBefore(dayjs());
  const saleHasNotStarted = saleStartDate.isAfter(dayjs());
  const streamHasFinished = endDate.isBefore(dayjs());
  const ongoing = startDate.isBefore(dayjs()) && endDate.isAfter(dayjs());

  const handleBuy = async () => {
    try {
      setPending(true);
      await buy.writeContractAsync({
        address: saleAddress,
        chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setPending(false);
    }
  };

  const purchased =
    !!accountTicketBalance.data && accountTicketBalance.data !== BigInt(0);
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
            <span>
              <div className={styles.streamStarts}>Stream starts</div>
              <span className={styles.subtitle}>
                {startDate.format("DD.MM.YY, HH:MM")} —{" "}
                {endDate.format("HH:MM")}
              </span>
            </span>

            {remainingAmount > 0 && startDate.isAfter(dayjs()) && (
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
                : `Pay ${price} ${paymentTokenSymbol} and buy access`
            }
            loading={loading || pending}
            tokenAddress={paymentTokenAddress}
            tokenAmount={parseUnits(price.toString(), paymentTokenDecimals)}
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

      {promos.length > 0 && <h3 className={styles.h3}>Promos</h3>}

      <div className={styles.promoList}>
        {promos.map((promo) => (
          <PromoCard key={promo.tokenId} {...promo} />
        ))}
      </div>
    </main>
  );
};
