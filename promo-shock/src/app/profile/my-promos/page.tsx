import type { FC } from "react";
import type { Address } from "viem";
import { getAccount } from "wagmi/actions";

import { queryClient } from "@promo-shock/configs/query";
import { web3Config } from "@promo-shock/configs/web3";
import { MyPromos, fetchInfinitePromoCards } from "@promo-shock/templates";

const MyPromosPage: FC = async () => {
  const account = getAccount(web3Config);
  const initialData = await queryClient.fetchInfiniteQuery({
    initialPageParam: 0,
    queryKey: ["promos", { owner: account.address }] as [
      "promos",
      filters?: { owner: Address },
    ],
    queryFn: fetchInfinitePromoCards,
  });
  return <MyPromos initialData={initialData} />;
};

export default MyPromosPage;
