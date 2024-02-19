import { notFound } from "next/navigation";
import type { FC } from "react";
import { erc20Abi, isAddress } from "viem";
import type { Address } from "viem";
import { readContracts } from "wagmi/actions";

import { queryClient } from "@promo-shock/configs/query";
import { web3Config } from "@promo-shock/configs/web3";
import {
  Stream,
  fetchPromoCards,
  fetchStreamCard,
} from "@promo-shock/templates";

const StreamPage: FC<{ params: { address: Address } }> = async ({
  params: { address },
}) => {
  if (!isAddress(address)) notFound();

  const stream = await queryClient.fetchQuery({
    queryKey: ["streams", address] as ["streams", string],
    queryFn: fetchStreamCard,
  });

  if (!stream) notFound();

  const promos = await queryClient.fetchQuery({
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
    <Stream
      {...stream}
      paymentTokenDecimals={decimals.result || 18}
      paymentTokenSymbol={symbol.result || ""}
      promos={promos}
    />
  );
};

export default StreamPage;
