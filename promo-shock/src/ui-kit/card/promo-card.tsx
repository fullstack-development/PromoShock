import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import type { FC } from "react";

import styles from "./streamCard.module.scss";
import { Button } from "../button";

type Props = {
  preview: string;
  startDate: number;
  endDate: number;
  title: string;
  description: string;
  url?: string;
};

export const PromoCard: FC<Props> = ({
  preview,
  endDate,
  startDate,
  url,
  title,
  description,
}) => {
  return (
    <a
      target="_blank"
      className={cn(styles.root, { [styles.root_disabled]: !url })}
      href={url}
    >
      <Image
        className={cn(styles.image, { [styles.image_disabled]: !url })}
        width={360}
        height={255}
        src={preview}
        alt="stream preview"
      />
      <div className={styles.row}>
        <span className={styles.subtitle}>
          {dayjs(startDate).format("DD.MM.YYYY")} -{" "}
          {dayjs(endDate).format("DD.MM.YYYY")}
        </span>
      </div>

      <div className={styles.description}>
        <h5 className={styles.title}>{title}</h5>
        <p>{description}</p>
      </div>

      <div className={cn(styles.center, styles.bottomDivider)}>
        <Button
          text="Go shopping"
          theme="primary"
          size="medium"
          disabled={!url}
        />
      </div>
    </a>
  );
};
