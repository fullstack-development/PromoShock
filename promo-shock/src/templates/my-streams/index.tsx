"use client";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import type { FC } from "react";

import type { UnwrapPromise } from "@promo-shock/shared/types";
import { CardList, StreamCard, TabList } from "@promo-shock/ui-kit";

import styles from "./my-streams.module.scss";
import { fetchInfiniteStreamCards } from "../queries";

const tabs = [
  { label: "My streams", url: "/profile/my-streams" },
  { label: "My promos", url: "/profile/my-promos" },
];

type Props = {
  initialData?: InfiniteData<
    UnwrapPromise<ReturnType<typeof fetchInfiniteStreamCards>>,
    number
  >;
  queryKey: [string, { owner: string; limit?: number }];
};

export const MyStreams: FC<Props> = ({ initialData, queryKey }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const streams = useInfiniteQuery({
    initialData,
    initialPageParam: 0,
    queryKey,
    queryFn: fetchInfiniteStreamCards,
    select: (data) => data.pages.map((item) => item.pages).flat(),
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  const selected = 0;
  const opposite = 1;

  const handleSelect = () => {
    router.push(tabs[opposite].url);
  };

  const highlightAddress = searchParams.get("highlight_address");

  return (
    <main className={styles.root}>
      <h1 className={styles.title}>My streams</h1>

      <div className={styles.tabs}>
        <TabList
          tabList={tabs}
          selected={selected}
          setSelected={handleSelect}
        />
      </div>

      <CardList>
        {streams.data?.map((stream) => (
          <StreamCard
            key={stream.saleAddress}
            highlight={stream.saleAddress === highlightAddress}
            watchOnly
            {...stream}
          />
        ))}
      </CardList>
    </main>
  );
};
