import type { FC } from "react";

import { Button, CardList, StreamCard } from "@promo-shock/ui-kit";

import styles from "./streams.module.scss";
import { STREAMS_PREVIEWS_MOCK } from "../landing/mocks/fixtures";

export const Streams: FC = () => {
  return (
    <main className={styles.root}>
      <h1 className={styles.title}>Streams</h1>

      <Button theme="quaternary" size="big" text="Add my own stream here" />

      <CardList>
        {[STREAMS_PREVIEWS_MOCK, STREAMS_PREVIEWS_MOCK, STREAMS_PREVIEWS_MOCK]
          .flat()
          .map((options) => (
            <StreamCard
              key={`${options.title}${options.description}`}
              {...options}
            />
          ))}
      </CardList>

      <Button text="Get more" size="medium" theme="tertiary" />
    </main>
  );
};
