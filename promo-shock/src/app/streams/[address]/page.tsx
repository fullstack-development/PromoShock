import type { FC } from "react";
import { erc20Abi, isAddress } from "viem";
import type { Address } from "viem";
import { readContracts } from "wagmi/actions";

import { readTicketSaleGetSaleParams } from "@generated/wagmi";

import { queryClient } from "@promo-shock/configs/query";
import { web3Config } from "@promo-shock/configs/web3";
import {
  Stream,
  fetchPromoCards,
  fetchStreamCards,
} from "@promo-shock/templates";

const StreamPage: FC<{ params: { address: Address } }> = async ({
  params: { address },
}) => {
  const streams = await queryClient.fetchQuery({
    queryKey: ["streams"] as ["streams"],
    queryFn: fetchStreamCards,
  });
  const data = streams.find((stream) => stream.saleAddress === address);

  if (!data) throw new Error("Stream not found");
  if (!isAddress(data.saleAddress)) throw new Error("Invalid address");

  const promos = await queryClient.fetchQuery({
    queryKey: ["promos", { stream: data.saleAddress }] as [
      "promos",
      { stream: string },
    ],
    queryFn: fetchPromoCards,
  });

  const { paymentToken, startTime, endTime } =
    await readTicketSaleGetSaleParams(web3Config, {
      chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
      address: data.saleAddress,
    });
  const [symbol, decimals] = await readContracts(web3Config, {
    contracts: [
      {
        chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
        abi: erc20Abi,
        functionName: "symbol",
        address: paymentToken,
      },
      {
        chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
        abi: erc20Abi,
        functionName: "decimals",
        address: paymentToken,
      },
    ],
  });

  return (
    <Stream
      {...data}
      saleAddress={data.saleAddress}
      ticketAddress={data.ticketAddress as Address}
      paymentTokenAddress={paymentToken}
      paymentTokenDecimals={decimals.result || 18}
      paymentTokenSymbol={symbol.result || ""}
      saleStartDate={Number(startTime)}
      saleEndDate={Number(endTime)}
      promos={promos}
    />
  );
};

export default StreamPage;
