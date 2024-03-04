"use client";
import { useSearchParams } from "next/navigation";
import type { FC } from "react";
import { useAccount } from "wagmi";

import { CardList } from "@promo-shock/components";
import type { Stream } from "@promo-shock/shared/entities";
import { fetchInfiniteStreamCards } from "@promo-shock/shared/queries";
import type { InferQueryKey } from "@promo-shock/shared/types";
import { StreamCard } from "@promo-shock/ui-kit";

type Props = {
  queryKey: InferQueryKey<typeof fetchInfiniteStreamCards>;
  enablePagination?: boolean;
};

const StreamCardListComponent: FC<Props> = ({ queryKey, enablePagination }) => {
  const account = useAccount();
  const params = useSearchParams();
  const highlightAddress = params.get("highlight_address");
  const searchParamsFilterKeys = params.get("filters")?.split(",");
  const isValidFilterKeys = searchParamsFilterKeys?.every(
    (filter): filter is "owner" | "buyer" =>
      ["owner", "buyer"].includes(filter),
  );

  return (
    <CardList
      queryKey={queryKey}
      queryFn={fetchInfiniteStreamCards}
      defaultFilterKeys={isValidFilterKeys ? searchParamsFilterKeys : undefined}
      enablePagination={enablePagination}
      filterOptions={
        [
          { label: "All", value: "all" },
          { label: "I bought", value: "buyer" },
          { label: "I created", value: "owner" },
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
  );
};

export { StreamCardListComponent };
