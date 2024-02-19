"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import type { FC } from "react";

import type { UnwrapPromise } from "@promo-shock/shared/types";
import { CardList, PromoCard, TabList } from "@promo-shock/ui-kit";

import styles from "./my-promos.module.scss";
import { fetchInfinitePromoCards } from "../queries";

type Props = {
  initialData?: InfiniteData<
    UnwrapPromise<ReturnType<typeof fetchInfinitePromoCards>>,
    number
  >;
  queryKey: [string, { owner: string; limit?: number }];
};

const tabs = [
  { label: "My streams", url: "/profile/my-streams" },
  { label: "My promos", url: "/profile/my-promos" },
];

export const MyPromos: FC<Props> = ({ initialData, queryKey }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const promos = useInfiniteQuery({
    initialData,
    initialPageParam: 0,
    queryKey,
    queryFn: fetchInfinitePromoCards,
    select: (data) => data.pages.map((item) => item.pages).flat(),
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  const selected = 1;
  const opposite = 0;

  const handleSelect = () => {
    router.push(tabs[opposite].url);
  };

  const highlightAddress = searchParams.get("highlight_address");

  return (
    <main className={styles.root}>
      <h1 className={styles.title}>My promos</h1>

      <div className={styles.tabs}>
        <TabList
          tabList={tabs}
          selected={selected}
          setSelected={handleSelect}
        />
      </div>

      <CardList>
        {promos.data?.map((promo) => (
          <PromoCard
            key={promo.tokenId}
            highlighted={promo.promoAddress === highlightAddress}
            {...promo}
          />
        ))}
      </CardList>
    </main>
  );
};
