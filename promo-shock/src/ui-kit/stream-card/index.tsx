import cn from "classnames";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import Image from "next/image";
import type { FC } from "react";

import styles from "./streamCard.module.scss";
import { Button } from "../button";

type Props = {
  preview: string;
  cost: number;
  date: Dayjs;
  title: string;
  description: string;
  ticketsTotal: number;
  ticketsLeft: number;
};

export const StreamCard: FC<Props> = ({
  preview,
  cost,
  date,
  title,
  description,
  ticketsTotal,
  ticketsLeft,
}) => {
  const ticketsAreOut = ticketsLeft < 1 && date.isAfter(dayjs());
  const streamHasFinished = date.isBefore(dayjs());

  return (
    <div className={styles.root}>
      <Image
        className={styles.image}
        width={360}
        height={255}
        src={preview}
        alt="stream preview"
      />
      <div className={styles.row}>
        <span className={styles.subtitle}>{date.format("DD.MM.YYYY")}</span>

        {ticketsLeft > 0 && date.isAfter(dayjs()) && (
          <span className={styles.subtitle}>
            {ticketsLeft < 5 ? <span className={styles.fire}>🔥</span> : ""}
            {ticketsLeft} of {ticketsTotal} tickets left
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
        <h5 className={styles.title}>{title}</h5>
        <p>{description}</p>
      </div>

      <div className={styles.row}>
        <span
          className={cn(styles.cost, {
            [styles.cost_lineThrough]: ticketsAreOut || streamHasFinished,
          })}
        >
          {cost} USDT
        </span>
        {ticketsAreOut || streamHasFinished ? (
          <Button text="See promos" theme="tertiary" size="medium" />
        ) : (
          <Button text="Buy access" theme="primary" size="medium" />
        )}
      </div>
    </div>
  );
};
