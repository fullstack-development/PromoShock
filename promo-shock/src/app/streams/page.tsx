import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { FC } from "react";

import { queryClient } from "@promo-shock/configs/query";
import { web3Config } from "@promo-shock/configs/web3";
import { fetchInfiniteStreamCards } from "@promo-shock/shared/queries";
import type { InferQueryKey } from "@promo-shock/shared/types";
import { getServerAccount } from "@promo-shock/shared/utils/wagmi";
import { Streams } from "@promo-shock/templates";

const StreamsPage: FC<{
  searchParams: { [key: string]: string | string[] | undefined };
}> = async ({ searchParams }) => {
  const filters = searchParams.filters;
  const defaultFilters = filters
    ? Array.isArray(filters)
      ? filters
      : filters.split(",")
    : undefined;
  const isValidFilters = defaultFilters?.every(
    (filter): filter is "owner" | "buyer" =>
      ["owner", "buyer"].includes(filter),
  );
  const address = getServerAccount(web3Config);
  const queryKey: InferQueryKey<typeof fetchInfiniteStreamCards> = [
    "streams",
    {
      limit: 6,
      owner:
        isValidFilters && defaultFilters?.includes("owner")
          ? address
          : undefined,
      buyer:
        isValidFilters && defaultFilters?.includes("buyer")
          ? address
          : undefined,
    },
  ];
  await queryClient.prefetchInfiniteQuery({
    initialPageParam: 0,
    queryKey,
    queryFn: fetchInfiniteStreamCards,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Streams queryKey={queryKey} />
    </HydrationBoundary>
  );
};

export default StreamsPage;
