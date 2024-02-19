"use client";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import type { FC } from "react";

import type { UnwrapPromise } from "@promo-shock/shared/types";
import { Button, CardList, StreamCard } from "@promo-shock/ui-kit";

import styles from "./streams.module.scss";
import { fetchInfiniteStreamCards } from "../queries";

type Props = {
  initialData?: InfiniteData<
    UnwrapPromise<ReturnType<typeof fetchInfiniteStreamCards>>,
    number
  >;
};

export const Streams: FC<Props> = ({ initialData }) => {
  const searchParams = useSearchParams();
  const streams = useInfiniteQuery({
    initialData,
    initialPageParam: 0,
    queryKey: ["streams"] as ["streams"],
    queryFn: fetchInfiniteStreamCards,
    select: (data) => data.pages.map((item) => item.pages).flat(),
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  const highlightAddress = searchParams.get("highlight_address");

  const handleGetMore = async () => {
    try {
      await streams.fetchNextPage();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className={styles.root}>
      <h1 className={styles.title}>Streams</h1>

      <Button
        theme="quaternary"
        size="big"
        text="Add my own stream here"
        href="/streams/pass-page"
      />

      <CardList>
        {streams.data?.map((stream) => (
          <StreamCard
            key={stream.address}
            highlight={stream.address === highlightAddress}
            {...stream}
          />
        ))}
      </CardList>

      {streams.hasNextPage && (
        <Button
          text="Get more"
          size="medium"
          theme="tertiary"
          loading={streams.isFetchingNextPage}
          onClick={handleGetMore}
        />
      )}
    </main>
  );
};
