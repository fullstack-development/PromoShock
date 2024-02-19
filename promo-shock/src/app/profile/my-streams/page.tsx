import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { FC } from "react";
import type { Address } from "viem";
import { cookieToInitialState } from "wagmi";

import { queryClient } from "@promo-shock/configs/query";
import { web3Config } from "@promo-shock/configs/web3";
import { MyStreams, fetchInfiniteStreamCards } from "@promo-shock/templates";

const MyStreamsPage: FC = async () => {
  const web3InitialState = cookieToInitialState(
    web3Config,
    headers().get("cookie"),
  );
  const account =
    web3InitialState?.current &&
    web3InitialState.connections.get(web3InitialState.current)?.accounts[0];

  if (!account) return redirect("/");

  const queryKey = ["streams", { owner: account }] as [
    string,
    { owner: Address },
  ];
  const initialData = await queryClient.fetchInfiniteQuery({
    initialPageParam: 0,
    queryKey,
    queryFn: fetchInfiniteStreamCards,
  });

  return <MyStreams initialData={initialData} queryKey={queryKey} />;
};

export default MyStreamsPage;
