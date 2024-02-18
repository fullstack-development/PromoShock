"use client";
import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import type { ComponentProps, FC } from "react";
import { parseUnits } from "viem";
import type { Address } from "viem";

import { useWriteTicketSaleBuy } from "@generated/wagmi";

import { withBalanceCheck, withSwitchNetwork } from "@promo-shock/components";
import { Button, PromoCard } from "@promo-shock/ui-kit";

import styles from "./stream.module.scss";

type Props = {
  name: string;
  description: string;
  address: Address;
  paymentToken: Address;
  paymentTokenSymbol: string;
  paymentTokenDecimals: number;
  saleStartDate: number;
  saleEndDate: number;
  banner: string;
  price: number;
  date: number;
  totalAmount: number;
  reservedAmount: number;
  promos: Array<ComponentProps<typeof PromoCard> & { id: string }>;
};

const TxButton = withBalanceCheck(withSwitchNetwork(Button));

export const Stream: FC<Props> = ({
  name,
  date: dateUnix,
  description,
  address,
  paymentToken,
  paymentTokenSymbol,
  paymentTokenDecimals,
  saleEndDate: saleEndDateUnix,
  saleStartDate: saleStartDateUnix,
  banner,
  price,
  totalAmount,
  reservedAmount,
  promos,
}) => {
  const date = dayjs(dateUnix);
  const saleEndDate = dayjs(saleEndDateUnix);
  const saleStartDate = dayjs(saleStartDateUnix);
  const buy = useWriteTicketSaleBuy();
  const remainingAmount = totalAmount - reservedAmount;
  const ticketsAreOut = remainingAmount === 0 && date.isAfter(dayjs());
  const saleHasFinished = saleEndDate.isBefore(dayjs());
  const saleHasNotStarted = saleStartDate.isAfter(dayjs());
  const streamHasFinished = date.isBefore(dayjs());

  const handleBuy = async () => {
    try {
      // TODO :: handle case when sale has not started or has finished
      if (saleHasFinished) throw new Error("Sale has finished");
      if (saleHasNotStarted) throw new Error("Sale has not started");
      await buy.writeContractAsync({
        address,
        chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className={styles.root}>
      <h1 className={styles.title}>{name}</h1>

      <Button
        className={styles.watchLink}
        theme="quaternary"
        size="big"
        text="Watch stream"
      />

      <div className={styles.streamInfoWrapper}>
        <div className={styles.streamInfo}>
          <Image
            className={styles.image}
            width={480}
            height={354}
            src={banner}
            alt="stream preview"
          />
          <div className={styles.row}>
            <span>
              <div className={styles.streamStarts}>Stream starts</div>
              <span className={styles.subtitle}>
                {date.format("DD.MM.YY, HH:MM")}
              </span>
            </span>

            {remainingAmount > 0 && date.isAfter(dayjs()) && (
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
            text={`Pay ${price} ${paymentTokenSymbol} and buy access`}
            tokenAddress={paymentToken}
            tokenAmount={parseUnits(price.toString(), paymentTokenDecimals)}
            onClick={handleBuy}
          />
        </div>

        <div className={styles.description}>
          {description}
          <Button theme="tertiary" size="medium" text="Follow streamer" />
        </div>
      </div>

      <h3 className={styles.h3}>Promos</h3>

      <div className={styles.promoList}>
        {promos.map((promo) => (
          <PromoCard key={promo.id} {...promo} />
        ))}
      </div>
    </main>
  );
};
