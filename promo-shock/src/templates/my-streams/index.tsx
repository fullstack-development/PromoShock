"use client";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useAccount } from "wagmi";

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
};

export const MyStreams: FC<Props> = ({ initialData }) => {
  const account = useAccount();
  const router = useRouter();
  const streams = useInfiniteQuery({
    initialData,
    initialPageParam: 0,
    queryKey: ["streams", { owner: account.address }] as [
      "streams",
      filters?: { owner: string },
    ],
    queryFn: fetchInfiniteStreamCards,
    select: (data) => data.pages.map((item) => item.pages).flat(),
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

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
        {streams.data?.map((stream) => (
          <StreamCard key={stream.address} {...stream} />
        ))}
      </CardList>
    </main>
  );
};
