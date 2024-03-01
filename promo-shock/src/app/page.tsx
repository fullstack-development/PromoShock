import type { FC } from "react";

import { queryClient } from "@promo-shock/configs/query";
import { fetchStreamCards } from "@promo-shock/shared/queries";
import { Landing } from "@promo-shock/templates";

const RootPage: FC = async () => {
  const streams = await queryClient.fetchQuery({
    queryKey: ["streams", { limit: 3 }] as [string, { limit?: number }],
    queryFn: fetchStreamCards,
  });
  return <Landing streams={streams} />;
};

export default RootPage;
