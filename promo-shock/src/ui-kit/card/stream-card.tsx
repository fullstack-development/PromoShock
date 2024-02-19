import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import type { FC } from "react";
import { useHover } from "react-use";

import styles from "./streamCard.module.scss";
import { Button } from "../button";
import { CopyToClipboard } from "../copy-to-clipboard";

type Props = {
  name: string;
  description: string;
  address: string;
  banner: string;
  price: number;
  date: number;
  totalAmount: number;
  reservedAmount: number;
  onlyWatch?: boolean;
};

export const StreamCard: FC<Props> = ({
  name,
  description,
  address,
  banner,
  price,
  date: dateUnix,
  totalAmount,
  reservedAmount,
  onlyWatch,
}) => {
  const [imageElement] = useHover((hovered) => (
    <div className={styles.image_wrap}>
      <div
        className={cn(styles.copy, {
          [styles.copy_hovered]: hovered,
        })}
      >
        <CopyToClipboard text={address} message="Copy ticket address" />
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
  const date = dayjs(dateUnix);
  const remainingAmount = totalAmount - reservedAmount;
  const ticketsAreOut = remainingAmount === 0 && date.isAfter(dayjs());
  const streamHasFinished = date.isBefore(dayjs());

  return (
    <div className={styles.root}>
      {imageElement}
      <div className={styles.row}>
        <span className={styles.subtitle}>{date.format("DD.MM.YYYY")}</span>

        {remainingAmount > 0 && date.isAfter(dayjs()) && (
          <span className={styles.subtitle}>
            {remainingAmount < 5 ? <span className={styles.fire}>🔥</span> : ""}
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

      <div className={styles.description}>
        <h5 className={styles.title}>{name}</h5>
        <p>{description}</p>
      </div>

      <div className={cn(styles.row, styles.bottomDivider)}>
        {!onlyWatch && (
          <>
            <span
              className={cn(styles.cost, {
                [styles.cost_lineThrough]: ticketsAreOut || streamHasFinished,
              })}
            >
              {price} USDT
            </span>
            {ticketsAreOut || streamHasFinished ? (
              <Button text="See promos" theme="tertiary" size="medium" />
            ) : (
              <Button
                text="Buy access"
                theme="primary"
                size="medium"
                href={`/streams/${address}`}
              />
            )}
          </>
        )}
        {onlyWatch && (
          <Button theme="quaternary" size="big" fullwidth text="Watch stream" />
        )}
      </div>
    </div>
  );
};
