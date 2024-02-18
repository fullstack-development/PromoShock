"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { FC } from "react";

import type { UnwrapPromise } from "@promo-shock/shared/types";
import { Button, CardList, PromoCard } from "@promo-shock/ui-kit";

import styles from "./promos.module.scss";
import { fetchInfinitePromoCards } from "../queries";

type Props = {
  initialData?: InfiniteData<
    UnwrapPromise<ReturnType<typeof fetchInfinitePromoCards>>,
    number
  >;
};

export const Promos: FC<Props> = ({ initialData }) => {
  const promos = useInfiniteQuery({
    initialData,
    initialPageParam: 0,
    queryKey: ["promos"] as ["promos"],
    queryFn: fetchInfinitePromoCards,
    select: (data) => data.pages.map((item) => item.pages).flat(),
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  const handleGetMore = async () => {
    try {
      await promos.fetchNextPage();
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
        text="Add my own promo here"
        href="/promos/new-promo"
      />

      <CardList>
        {promos.data?.map((promo) => <PromoCard key={promo.id} {...promo} />)}
      </CardList>

      {promos.hasNextPage && (
        <Button
          text="Get more"
          size="medium"
          theme="tertiary"
          loading={promos.isFetchingNextPage}
          onClick={handleGetMore}
        />
      )}
    </main>
  );
};
