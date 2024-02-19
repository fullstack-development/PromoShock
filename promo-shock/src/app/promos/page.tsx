import type { FC } from "react";

import { queryClient } from "@promo-shock/configs/query";
import { Promos, fetchInfinitePromoCards } from "@promo-shock/templates";

const PromosPage: FC = async () => {
  const queryKey = ["promos", { limit: 6 }] as ["promos", { limit?: number }];
  const initialData = await queryClient.fetchInfiniteQuery({
    initialPageParam: 0,
    queryKey,
    queryFn: fetchInfinitePromoCards,
  });

  return <Promos initialData={initialData} queryKey={queryKey} />;
};

export default PromosPage;
