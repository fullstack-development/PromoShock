"use client";
import { useSearchParams } from "next/navigation";
import type { FC } from "react";
import { useAccount } from "wagmi";

import { CardList } from "@promo-shock/components";
import type { Stream } from "@promo-shock/shared/entities";
import type { InferQueryKey } from "@promo-shock/shared/types";
import { Button, StreamCard } from "@promo-shock/ui-kit";

import styles from "./streams.module.scss";
import { fetchInfiniteStreamCards } from "../queries";

type Props = {
  queryKey: InferQueryKey<typeof fetchInfiniteStreamCards>;
};

export const Streams: FC<Props> = ({ queryKey }) => {
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
        <h1 className={styles.title}>Streams</h1>
        <Button
          theme="quaternary"
          size="big"
          text="Add my own stream here"
          href="/streams/pass-page"
        />
      </div>

      <CardList
        queryKey={queryKey}
        queryFn={fetchInfiniteStreamCards}
        defaultFilterKeys={
          isValidFilterKeys ? searchParamsFilterKeys : undefined
        }
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
        {(stream: Stream) => (
          <StreamCard
            key={stream.saleAddress}
            highlight={stream.saleAddress === highlightAddress}
            {...stream}
          />
        )}
      </CardList>
    </main>
  );
};
