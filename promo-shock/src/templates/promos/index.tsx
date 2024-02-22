"use client";
import type { FC } from "react";
import { useAccount } from "wagmi";

import { CardList } from "@promo-shock/components";
import type { Promo } from "@promo-shock/shared/entities";
import type { InferQueryKey } from "@promo-shock/shared/types";
import { Button, PromoCard } from "@promo-shock/ui-kit";

import styles from "./promos.module.scss";
import { fetchInfinitePromoCards } from "../queries";

type Props = {
  queryKey: InferQueryKey<typeof fetchInfinitePromoCards>;
};

const Promos: FC<Props> = ({ queryKey }) => {
  const account = useAccount();

  return (
    <main className={styles.root}>
      <div className={styles.header}>
        <h1 className={styles.title}>Promos</h1>
        <Button
          theme="quaternary"
          size="big"
          text="Add my own promo here"
          href="/promos/new-promo"
        />
      </div>

      <CardList
        queryKey={queryKey}
        queryFn={fetchInfinitePromoCards}
        filterOptions={
          [
            { label: "All", value: "all" },
            { label: "I created", value: "owner" },
            { label: "I bought", value: "buyer" },
          ] as const
        }
        mapKeysToFilter={(filterKeys) => ({
          owner: filterKeys.includes("owner") ? account.address : undefined,
          buyer: filterKeys.includes("buyer") ? account.address : undefined,
        })}
      >
        {(promo: Promo) => <PromoCard key={promo.tokenId} {...promo} />}
      </CardList>
    </main>
  );
};

export { Promos };
