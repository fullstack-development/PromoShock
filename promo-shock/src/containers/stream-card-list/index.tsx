import { pageContext } from "@sodefa/next-server-context";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { FC } from "react";

import { queryClient } from "@promo-shock/configs/query";
import { fetchInfiniteStreamCards } from "@promo-shock/shared/queries";
import type { InferQueryKey } from "@promo-shock/shared/types";
import { getServerAccount } from "@promo-shock/shared/utils/wagmi";

import { StreamCardListComponent } from "./component";

type Props = {
  limit?: number;
  enablePagination?: boolean;
};

const StreamCardList: FC<Props> = async ({ limit = 6, enablePagination }) => {
  const { searchParams } = pageContext.getOrThrow();
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
  const address = getServerAccount();
  const queryKey: InferQueryKey<typeof fetchInfiniteStreamCards> = [
    "streams",
    {
      limit,
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
      <StreamCardListComponent
        queryKey={queryKey}
        enablePagination={enablePagination}
      />
    </HydrationBoundary>
  );
};

export { StreamCardList };
