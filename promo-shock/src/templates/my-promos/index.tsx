"use client";

import { useRouter } from "next/navigation";
import type { FC } from "react";

import type { Promo } from "@promo-shock/shared/types";
import { CardList, PromoCard, TabList } from "@promo-shock/ui-kit";

import styles from "./my-promos.module.scss";

type Props = {
  data: Promo[];
};

const tabs = [
  { label: "My streams", url: "/profile/my-streams" },
  { label: "My promos", url: "/profile/my-promos" },
];

export const MyPromos: FC<Props> = ({ data }) => {
  const router = useRouter();

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
        {data.map((options) => (
          <PromoCard key={options.id} {...options} />
        ))}
      </CardList>
    </main>
  );
};
