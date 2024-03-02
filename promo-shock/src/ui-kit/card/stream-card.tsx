"use client";
import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import type { FC } from "react";
import { useHover } from "react-use";
import { erc20Abi, formatUnits } from "viem";
import { useReadContracts } from "wagmi";

import type { Stream } from "@promo-shock/shared/entities";

import styles from "./card.module.scss";
import { Button } from "../button";
import { CopyToClipboard } from "../copy-to-clipboard";

type Props = Omit<
  Stream,
  "streamerLink" | "streamLink" | "purchased" | "saleAddress"
> & {
  highlight?: boolean;
  watchOnly?: boolean;
};

export const StreamCard: FC<Props> = ({
  name,
  description,
  ticketAddress,
  paymentTokenAddress,
  banner,
  price,
  startDate: startDateUnix,
  endDate: endDateUnix,
  saleStartDate: saleStartDateUnix,
  saleEndDate: saleEndDateUnix,
  totalAmount,
  reservedAmount,
  highlight,
  watchOnly,
}) => {
  const tokenInfo = useReadContracts({
    query: {
      staleTime: Infinity,
    },
    contracts: [
      {
        chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
        abi: erc20Abi,
        address: paymentTokenAddress,
        functionName: "decimals",
      },
      {
        chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
        abi: erc20Abi,
        address: paymentTokenAddress,
        functionName: "symbol",
      },
    ],
  });
  const [tokenDecimals, tokenSymbol] = tokenInfo.data || [];
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
        sizes="33vw"
        src={banner || ""}
        alt="stream banner"
      />
    </div>
  ));
  const now = dayjs.utc();
  const startDate = dayjs.utc(startDateUnix);
  const endDate = dayjs.utc(endDateUnix);
  const ongoing =
    (startDate.isBefore(now) && endDate.isAfter(now)) || watchOnly;
  const saleStartDate = dayjs.utc(saleStartDateUnix);
  const saleEndDate = dayjs.utc(saleEndDateUnix);
  const remainingAmount = totalAmount - reservedAmount;
  const ticketsAreOut = remainingAmount === 0 && startDate.isAfter(now);
  const streamHasFinished = endDate.isBefore(now);

  return (
    <div className={styles.wrap}>
      {highlight && <div className={styles.highlight} />}
      <div
        className={cn(styles.root, {
          [styles.root_highlight]: highlight,
        })}
      >
        {imageElement}
        <div className={styles.row}>
          <span className={styles.subtitle}>
            {startDate.format("DD.MM.YYYY")}
          </span>

          {!watchOnly && remainingAmount > 0 && !streamHasFinished && (
            <span className={styles.subtitle}>
              {remainingAmount < 5 ? (
                <span className={styles.fire}>🔥</span>
              ) : (
                ""
              )}
              {remainingAmount} of {totalAmount} tickets left
            </span>
          )}

          {!watchOnly && ticketsAreOut && (
            <span className={cn(styles.subtitle, styles.error)}>
              💔 No tickets left
            </span>
          )}

          {!watchOnly && streamHasFinished && (
            <span className={cn(styles.subtitle, styles.error)}>
              🚫 Stream has finished
            </span>
          )}
        </div>

        <div className={styles.description}>
          <h5 className={styles.title}>{name}</h5>
          <p>{description}</p>
        </div>

        <div className={cn(styles.row, styles.bottomDivider)}>
          {!ongoing && (
            <>
              <span
                className={cn(styles.cost, {
                  [styles.cost_lineThrough]:
                    (ticketsAreOut || streamHasFinished) &&
                    !tokenInfo.isLoading,
                })}
              >
                {!tokenInfo.isLoading
                  ? tokenDecimals?.result && tokenSymbol?.result
                    ? `${formatUnits(BigInt(price), tokenDecimals.result)} ${
                        tokenSymbol.result
                      }`
                    : price
                  : "loading..."}
              </span>
              {ticketsAreOut || streamHasFinished ? (
                <Button
                  text="See promos"
                  theme="tertiary"
                  size="medium"
                  href={`/streams/${ticketAddress}`}
                />
              ) : (
                <Button
                  text="Buy access"
                  theme="primary"
                  size="medium"
                  href={`/streams/${ticketAddress}`}
                />
              )}
            </>
          )}
          {ongoing && (
            <Button
              theme="quaternary"
              size="big"
              fullwidth
              href={`/streams/${ticketAddress}`}
              text="Watch stream"
            />
          )}
        </div>
        <span className={styles.sale_period}>
          Selling period: {saleStartDate.format("DD.MM.YY")} —{" "}
          {saleEndDate.format("DD.MM.YY")}
        </span>
      </div>
    </div>
  );
};
