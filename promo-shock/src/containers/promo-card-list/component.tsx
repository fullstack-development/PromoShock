"use client";
import { useSearchParams } from "next/navigation";
import type { FC } from "react";
import { useAccount } from "wagmi";

import { CardList } from "@promo-shock/components";
import type { Promo } from "@promo-shock/shared/entities";
import { fetchInfinitePromoCards } from "@promo-shock/shared/queries";
import type { InferQueryKey } from "@promo-shock/shared/types";
import { PromoCard } from "@promo-shock/ui-kit";

type Props = {
  queryKey: InferQueryKey<typeof fetchInfinitePromoCards>;
  enablePagination?: boolean;
};

const PromoCardListComponent: FC<Props> = ({ queryKey, enablePagination }) => {
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
      queryFn={fetchInfinitePromoCards}
      defaultFilterKeys={isValidFilterKeys ? searchParamsFilterKeys : undefined}
      enablePagination={enablePagination}
      filterOptions={
        [
          { label: "All", value: "all" },
          { label: "I received", value: "buyer" },
          { label: "I created", value: "owner" },
        ] as const
      }
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
  );
};

export { PromoCardListComponent };
