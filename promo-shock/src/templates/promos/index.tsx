import type { FC } from "react";

import { PromoCardList } from "@promo-shock/containers";
import { Button } from "@promo-shock/ui-kit";

import styles from "./promos.module.scss";

const Promos: FC = () => {
  return (
    <main className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Promos</h1>
        <Button
          theme="quaternary"
          size="big"
          text="Add my own promo here"
          href="/promos/new-promo"
        />
      </div>
      <PromoCardList />
    </main>
  );
};

export { Promos };
