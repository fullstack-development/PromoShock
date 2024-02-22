import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { FC } from "react";

import { queryClient } from "@promo-shock/configs/query";
import type { InferQueryKey } from "@promo-shock/shared/types";
import { Promos, fetchInfinitePromoCards } from "@promo-shock/templates";

const PromosPage: FC = async () => {
  const queryKey: InferQueryKey<typeof fetchInfinitePromoCards> = [
    "promos",
    { limit: 6 },
  ];
  await queryClient.prefetchInfiniteQuery({
    initialPageParam: 0,
    queryKey,
    queryFn: fetchInfinitePromoCards,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Promos queryKey={queryKey} />
    </HydrationBoundary>
  );
};

export default PromosPage;
