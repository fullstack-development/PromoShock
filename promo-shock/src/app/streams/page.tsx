import type { FC } from "react";

import { queryClient } from "@promo-shock/configs/query";
import { Streams, fetchInfiniteStreamCards } from "@promo-shock/templates";

const StreamsPage: FC = async () => {
  const initialData = await queryClient.fetchInfiniteQuery({
    initialPageParam: 0,
    queryKey: ["streams"] as ["streams"],
    queryFn: fetchInfiniteStreamCards,
  });

  return <Streams initialData={initialData} />;
};

export default StreamsPage;
