import type { FC } from "react";
import type { Address } from "viem";
import { getAccount } from "wagmi/actions";

import { queryClient } from "@promo-shock/configs/query";
import { web3Config } from "@promo-shock/configs/web3";
import { MyStreams, fetchInfiniteStreamCards } from "@promo-shock/templates";

const MyStreamsPage: FC = async () => {
  const account = getAccount(web3Config);
  const initialData = await queryClient.fetchInfiniteQuery({
    initialPageParam: 0,
    queryKey: ["streams", { owner: account.address }] as [
      "streams",
      filters?: { owner: Address },
    ],
    queryFn: fetchInfiniteStreamCards,
  });

  return <MyStreams initialData={initialData} />;
};

export default MyStreamsPage;
