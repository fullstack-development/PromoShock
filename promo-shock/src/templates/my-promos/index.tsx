"use client";

import type { FC } from "react";

import type { Promo } from "@promo-shock/shared/types";
import { CardList, PromoCard } from "@promo-shock/ui-kit";

import styles from "./my-promos.module.scss";

type Props = {
  data: Promo[];
};

export const MyPromos: FC<Props> = ({ data }) => {
  return (
    <main className={styles.root}>
      <h1 className={styles.title}>My promos</h1>

      <CardList>
        {data.map((options) => (
          <PromoCard
            key={`${options.title}${options.description}`}
            {...options}
          />
        ))}
      </CardList>
    </main>
  );
};
