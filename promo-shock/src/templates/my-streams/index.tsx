"use client";

import { useRouter } from "next/navigation";
import type { FC } from "react";

import type { Stream } from "@promo-shock/shared/types";
import { CardList, StreamCard, TabList } from "@promo-shock/ui-kit";

import styles from "./my-streams.module.scss";

type Props = {
  data: Stream[];
};

const tabs = [
  { label: "My streams", url: "/profile/my-streams" },
  { label: "My promos", url: "/profile/my-promos" },
];

export const MyStreams: FC<Props> = ({ data }) => {
  const router = useRouter();

  const selected = 0;
  const opposite = 1;

  const handleSelect = () => {
    router.push(tabs[opposite].url);
  };

  return (
    <main className={styles.root}>
      <h1 className={styles.title}>My streams</h1>

      <TabList tabList={tabs} selected={selected} setSelected={handleSelect} />

      <CardList>
        {data.map((options) => (
          <StreamCard
            key={`${options.title}${options.description}`}
            {...options}
            onlyWatch
          />
        ))}
      </CardList>
    </main>
  );
};
