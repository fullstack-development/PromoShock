import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import type { FC } from "react";
import { useHover } from "react-use";
import { erc721Abi } from "viem";
import { useReadContract } from "wagmi";

import type { Stream } from "@promo-shock/shared/entities";

import styles from "./streamCard.module.scss";
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
  const paymentTokenSymbol = useReadContract({
    abi: erc721Abi,
    address: paymentTokenAddress,
    functionName: "symbol",
  });
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
  const startDate = dayjs(startDateUnix);
  const endDate = dayjs(endDateUnix);
  const ongoing =
    (startDate.isBefore(dayjs()) && endDate.isAfter(dayjs())) || watchOnly;
  const saleStartDate = dayjs(saleStartDateUnix);
  const saleEndDate = dayjs(saleEndDateUnix);
  const remainingAmount = totalAmount - reservedAmount;
  const ticketsAreOut = remainingAmount === 0 && startDate.isAfter(dayjs());
  const streamHasFinished = endDate.isBefore(dayjs());

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
                  [styles.cost_lineThrough]: ticketsAreOut || streamHasFinished,
                })}
              >
                {paymentTokenSymbol.data
                  ? `${price} ${paymentTokenSymbol.data}`
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
