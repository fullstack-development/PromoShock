import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";

const bscChains = {
  "56": bsc,
  "97": bscTestnet,
} as const;

const web3Config = getDefaultConfig({
  appName: "AcneShop",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
  chains: [bscChains[process.env.NEXT_PUBLIC_BSC_CHAIN_ID]],
  transports: {
    [process.env.NEXT_PUBLIC_BSC_CHAIN_ID]: http(
      process.env.NEXT_PUBLIC_BNB_RPC_URL,
    ),
  },
  ssr: true,
});

export { web3Config };
