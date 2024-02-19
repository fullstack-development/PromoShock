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
  queryKey: [string, { limit?: number }];
};

const Promos: FC<Props> = ({ initialData, queryKey }) => {
  const promos = useInfiniteQuery({
    initialData,
    initialPageParam: 0,
    queryKey,
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
      <h1 className={styles.title}>Promos</h1>

      <Button
        theme="quaternary"
        size="big"
        text="Add my own promo here"
        href="/promos/new-promo"
      />

      <CardList>
        {promos.data?.map((promo) => (
          <PromoCard key={promo.tokenId} {...promo} />
        ))}
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

export { Promos };
