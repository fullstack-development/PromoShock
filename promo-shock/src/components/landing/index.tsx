import type { FC } from "react";

import { Button } from "@promo-shock/ui-kit";

import styles from "./landing.module.scss";

export const Landing: FC = () => (
  <main className={styles.root}>
    <h1 className={styles.title}>Streams with benefits for...</h1>

    <Button theme="secondary" size="largeWide" text="I wanna try" />
  </main>
);
