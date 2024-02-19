"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useAccount } from "wagmi";

import type { UnwrapPromise } from "@promo-shock/shared/types";
import { CardList, PromoCard, TabList } from "@promo-shock/ui-kit";

import styles from "./my-promos.module.scss";
import { fetchInfinitePromoCards } from "../queries";

type Props = {
  initialData?: InfiniteData<
    UnwrapPromise<ReturnType<typeof fetchInfinitePromoCards>>,
    number
  >;
};

const tabs = [
  { label: "My streams", url: "/profile/my-streams" },
  { label: "My promos", url: "/profile/my-promos" },
];

export const MyPromos: FC<Props> = ({ initialData }) => {
  const account = useAccount();
  const router = useRouter();
  const promos = useInfiniteQuery({
    initialData,
    initialPageParam: 0,
    queryKey: ["promos", { owner: account.address }] as [
      "promos",
      filters?: { owner: string },
    ],
    queryFn: fetchInfinitePromoCards,
    select: (data) => data.pages.map((item) => item.pages).flat(),
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  const selected = 1;
  const opposite = 0;

  const handleSelect = () => {
    router.push(tabs[opposite].url);
  };

  return (
    <main className={styles.root}>
      <h1 className={styles.title}>My promos</h1>

      <TabList tabList={tabs} selected={selected} setSelected={handleSelect} />

      <CardList>
        {promos.data?.map((promo) => <PromoCard key={promo.id} {...promo} />)}
      </CardList>
    </main>
  );
};
