import type { FC } from "react";

import { queryClient } from "@promo-shock/configs/query";
import { Landing, fetchStreamCards } from "@promo-shock/templates";

const RootPage: FC = async () => {
  const streams = await queryClient.fetchQuery({
    queryKey: ["streams", { limit: 3 }] as ["streams", { limit?: number }],
    queryFn: fetchStreamCards,
  });
  return <Landing streams={streams} />;
};

export default RootPage;
