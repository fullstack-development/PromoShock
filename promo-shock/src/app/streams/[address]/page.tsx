import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import type { FC } from "react";
import { erc20Abi, isAddress } from "viem";
import type { Address } from "viem";
import { readContracts } from "wagmi/actions";

import { queryClient } from "@promo-shock/configs/query";
import { web3Config } from "@promo-shock/configs/web3";
import { fetchPromoCards, fetchStreamCard } from "@promo-shock/shared/queries";
import type { InferQueryKey } from "@promo-shock/shared/types";
import { Stream } from "@promo-shock/templates";

const StreamPage: FC<{ params: { address: Address } }> = async ({
  params: { address },
}) => {
  if (!isAddress(address)) notFound();
  const queryKey: InferQueryKey<typeof fetchStreamCard> = ["streams", address];
  const stream = await queryClient.fetchQuery({
    queryKey,
    queryFn: fetchStreamCard,
  });

  if (!stream) notFound();

  const promosQueryKey: InferQueryKey<typeof fetchPromoCards> = [
    "promos",
    { stream: stream.ticketAddress },
  ];
  await queryClient.prefetchQuery({
    queryKey: ["promos", { stream: stream.ticketAddress }] as [
      "promos",
      { stream: string },
    ],
    queryFn: fetchPromoCards,
  });

  const [symbol, decimals] = await readContracts(web3Config, {
    contracts: [
      {
        chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
        abi: erc20Abi,
        functionName: "symbol",
        address: stream.paymentTokenAddress,
      },
      {
        chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
        abi: erc20Abi,
        functionName: "decimals",
        address: stream.paymentTokenAddress,
      },
    ],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stream
        queryKey={queryKey}
        promosQueryKey={promosQueryKey}
        paymentTokenDecimals={decimals.result || 18}
        paymentTokenSymbol={symbol.result || ""}
      />
    </HydrationBoundary>
  );
};

export default StreamPage;
