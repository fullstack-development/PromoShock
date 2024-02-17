"use client";

import type { FC } from "react";

import { Button, CardList, PromoCard } from "@promo-shock/ui-kit";

import { PROMOS_LIST_MOCK } from "./mocks/fixtures";
import styles from "./promos.module.scss";

export const Promos: FC = () => {
  return (
    <main className={styles.root}>
      <h1 className={styles.title}>Streams</h1>

      <Button
        theme="quaternary"
        size="big"
        text="Add my own stream here"
        href="/promos/new-promo"
      />

      <CardList>
        {PROMOS_LIST_MOCK.map((options) => (
          <PromoCard
            key={`${options.title}${options.description}`}
            {...options}
          />
        ))}
      </CardList>

      <Button text="Get more" size="medium" theme="tertiary" />
    </main>
  );
};
