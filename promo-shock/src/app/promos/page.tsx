import type { FC } from "react";

import { queryClient } from "@promo-shock/configs/query";
import { Promos, fetchInfinitePromoCards } from "@promo-shock/templates";

const PromosPage: FC = async () => {
  const initialData = await queryClient.fetchInfiniteQuery({
    initialPageParam: 0,
    queryKey: ["promos"] as ["promos"],
    queryFn: fetchInfinitePromoCards,
  });

  return <Promos initialData={initialData} />;
};

export default PromosPage;
