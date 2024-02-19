import type { FC } from "react";

import { queryClient } from "@promo-shock/configs/query";
import { Streams, fetchInfiniteStreamCards } from "@promo-shock/templates";

const StreamsPage: FC = async () => {
  const queryKey = ["streams", { limit: 6 }] as ["streams", { limit?: number }];
  const initialData = await queryClient.fetchInfiniteQuery({
    initialPageParam: 0,
    queryKey,
    queryFn: fetchInfiniteStreamCards,
  });

  return <Streams initialData={initialData} queryKey={queryKey} />;
};

export default StreamsPage;
