"use client";
import cn from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import type { FC } from "react";

import styles from "./card.module.scss";
import { Button } from "../button";
import { Link } from "../link";

type Props = {
  tokenId: string;
  promoAddress: string;
  name: string;
  description: string;
  cover: string;
  startDate: number;
  endDate: number;
  shoppingLink: string;
  highlighted?: boolean;
};

export const PromoCard: FC<Props> = ({
  name,
  cover,
  endDate: endDateUnix,
  startDate: startDateUnix,
  shoppingLink,
  description,
  highlighted,
}) => {
  const startDate = dayjs(startDateUnix);
  const endDate = dayjs(endDateUnix);
  return (
    <div className={styles.wrap}>
      {highlighted && <div className={styles.highlight}></div>}
      <div
        className={cn(styles.root, {
          [styles.root_highlighted]: highlighted,
        })}
      >
        <Link external href={shoppingLink}>
          <Image
            className={cn(styles.image)}
            width={360}
            height={255}
            src={cover}
            alt="stream cover"
          />
        </Link>
        <div className={styles.row}>
          <span className={styles.subtitle}>
            {startDate.format("DD.MM.YYYY")} - {endDate.format("DD.MM.YYYY")}
          </span>
        </div>

        <div className={styles.description}>
          <Link external href={shoppingLink} className={styles.title}>
            {name}
          </Link>
          <p>{description}</p>
        </div>

        <div className={cn(styles.center, styles.bottomDivider)}>
          <Button
            text="Go shopping"
            theme="primary"
            size="medium"
            href={shoppingLink}
          />
        </div>
      </div>
    </div>
  );
};
