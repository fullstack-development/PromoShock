import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import type { FC } from "react";

import type { Promo, Stream as StreamType } from "@promo-shock/shared/types";
import { Button, PromoCard } from "@promo-shock/ui-kit";

import styles from "./stream.module.scss";

type Props = StreamType & { promos: Promo[] };

export const Stream: FC<Props> = ({
  title,
  date: dateTimestamp,
  ticketsLeft,
  ticketsTotal,
  preview,
  description,
  promos,
}) => {
  const date = dayjs(dateTimestamp);
  const ticketsAreOut = ticketsLeft < 1 && date.isAfter(dayjs());
  const streamHasFinished = date.isBefore(dayjs());

  return (
    <main className={styles.root}>
      <h1 className={styles.title}>{title}</h1>

      <Button theme="quaternary" size="big" text="Add my own stream here" />

      <div className={styles.streamInfoWrapper}>
        <div className={styles.streamInfo}>
          <Image
            className={styles.image}
            width={480}
            height={354}
            src={preview}
            alt="stream preview"
          />
          <div className={styles.row}>
            <span>
              <div className={styles.streamStarts}>Stream starts</div>
              <span className={styles.subtitle}>
                {date.format("DD.MM.YY, HH:MM")}
              </span>
            </span>

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

          <Button theme="secondary" size="largeWide" text="Buy access" />
        </div>

        <div className={styles.description}>
          {description}
          <Button theme="tertiary" size="medium" text="Follow streamer" />
        </div>
      </div>

      <h3 className={styles.h3}>Promos</h3>

      <div className={styles.promoList}>
        {promos.map((options) => (
          <PromoCard
            key={`${options.title}${options.description}`}
            {...options}
          />
        ))}
      </div>
    </main>
  );
};
