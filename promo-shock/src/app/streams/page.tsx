import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { FC } from "react";

import { queryClient } from "@promo-shock/configs/query";
import type { InferQueryKey } from "@promo-shock/shared/types";
import { Streams, fetchInfiniteStreamCards } from "@promo-shock/templates";

const StreamsPage: FC = async () => {
  const queryKey: InferQueryKey<typeof fetchInfiniteStreamCards> = [
    "streams",
    { limit: 6 },
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
