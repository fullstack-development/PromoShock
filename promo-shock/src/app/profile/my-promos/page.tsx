import { headers } from "next/headers";
import type { FC } from "react";
import type { Address } from "viem";
import { cookieToInitialState } from "wagmi";

import { queryClient } from "@promo-shock/configs/query";
import { web3Config } from "@promo-shock/configs/web3";
import { MyPromos, fetchInfinitePromoCards } from "@promo-shock/templates";

const MyPromosPage: FC = async () => {
  const web3InitialState = cookieToInitialState(
    web3Config,
    headers().get("cookie"),
  );
  const account =
    web3InitialState?.current &&
    web3InitialState.connections.get(web3InitialState.current)?.accounts[0];

  const queryKey = ["promos", { owner: account }] as [
    string,
    { owner: Address },
  ];
  const initialData = await queryClient.fetchInfiniteQuery({
    initialPageParam: 0,
    queryKey,
    queryFn: fetchInfinitePromoCards,
  });
  return <MyPromos initialData={initialData} queryKey={queryKey} />;
};

export default MyPromosPage;
