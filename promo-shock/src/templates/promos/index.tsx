"use client";
import { useSearchParams } from "next/navigation";
import type { FC } from "react";
import { useAccount } from "wagmi";

import { CardList } from "@promo-shock/components";
import type { Promo } from "@promo-shock/shared/entities";
import { fetchInfinitePromoCards } from "@promo-shock/shared/queries";
import type { InferQueryKey } from "@promo-shock/shared/types";
import { Button, PromoCard } from "@promo-shock/ui-kit";

import styles from "./promos.module.scss";

type Props = {
  queryKey: InferQueryKey<typeof fetchInfinitePromoCards>;
};

const Promos: FC<Props> = ({ queryKey }) => {
  const account = useAccount();
  const params = useSearchParams();
  const highlightAddress = params.get("highlight_address");
  const searchParamsFilterKeys = params.get("filters")?.split(",");
  const isValidFilterKeys = searchParamsFilterKeys?.every(
    (filter): filter is "owner" | "buyer" =>
      ["owner", "buyer"].includes(filter),
  );

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
        emptyStateMessage="Oops, you don't have any promos yet. Grab a ticket to the stream to check out the promos available!"
        defaultFilterKeys={
          isValidFilterKeys ? searchParamsFilterKeys : undefined
        }
        filterOptions={(
          [
            { label: "All", value: "all" },
            { label: "I received", value: "buyer" },
            { label: "I created", value: "owner" },
          ] as const
        ).filter((item) => item.value === "all" || !!account.address)}
        mapKeysToFilter={(filterKeys) => ({
          owner: filterKeys.includes("owner") ? account.address : undefined,
          buyer: filterKeys.includes("buyer") ? account.address : undefined,
        })}
      >
        {(promo: Promo, idx: number) => (
          <PromoCard
            key={promo.tokenId + promo.promoAddress + idx.toString()}
            highlighted={promo.promoAddress === highlightAddress}
            {...promo}
          />
        )}
      </CardList>
    </main>
  );
};

export { Promos };
