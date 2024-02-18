import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import type { FC } from "react";

import styles from "./streamCard.module.scss";
import { Button } from "../button";

type Props = {
  name: string;
  description: string;
  cover: string;
  startDate: number;
  endDate: number;
  saleUrl?: string;
};

export const PromoCard: FC<Props> = ({
  name,
  cover,
  endDate: endDateUnix,
  startDate: startDateUnix,
  saleUrl,
  description,
}) => {
  const startDate = dayjs(startDateUnix);
  const endDate = dayjs(endDateUnix);
  return (
    <a
      target="_blank"
      className={cn(styles.root, { [styles.root_disabled]: !saleUrl })}
      href={saleUrl}
    >
      <Image
        className={cn(styles.image, { [styles.image_disabled]: !saleUrl })}
        width={360}
        height={255}
        src={cover}
        alt="stream cover"
      />
      <div className={styles.row}>
        <span className={styles.subtitle}>
          {startDate.format("DD.MM.YYYY")} - {endDate.format("DD.MM.YYYY")}
        </span>
      </div>

      <div className={styles.description}>
        <h5 className={styles.title}>{name}</h5>
        <p>{description}</p>
      </div>

      <div className={cn(styles.center, styles.bottomDivider)}>
        <Button
          text="Go shopping"
          theme="primary"
          size="medium"
          disabled={!saleUrl}
        />
      </div>
    </a>
  );
};
