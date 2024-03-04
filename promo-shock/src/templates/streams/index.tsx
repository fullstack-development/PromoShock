import type { FC } from "react";

import { StreamCardList } from "@promo-shock/containers";
import { Button } from "@promo-shock/ui-kit";

import styles from "./streams.module.scss";

export const Streams: FC = () => {
  return (
    <main className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Streams</h1>
        <Button
          theme="quaternary"
          size="big"
          text="Launch a ticket sale for my stream"
          href="/streams/pass-page"
        />
      </div>
      <StreamCardList />
    </main>
  );
};
