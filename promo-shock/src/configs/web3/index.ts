import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";

const bscChains = {
  "56": bsc,
  "97": bscTestnet,
} as const;

const web3Config =
  typeof window === "undefined"
    ? createConfig({
        chains: [bscChains[process.env.NEXT_PUBLIC_BSC_CHAIN_ID]],
        // @ts-expect-error type of NEXT_PUBLIC_BSC_CHAIN_ID is 56 | 97
        transports: {
          [process.env.NEXT_PUBLIC_BSC_CHAIN_ID]: http(
            process.env.NEXT_PUBLIC_BNB_RPC_URL,
          ),
        },
        ssr: true,
        storage: createStorage({
          storage: cookieStorage,
        }),
      })
    : getDefaultConfig({
        appName: "PromoShock",
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
        chains: [bscChains[process.env.NEXT_PUBLIC_BSC_CHAIN_ID]],
        transports: {
          [process.env.NEXT_PUBLIC_BSC_CHAIN_ID]: http(
            process.env.NEXT_PUBLIC_BNB_RPC_URL,
          ),
        },
        ssr: true,
        storage: createStorage({
          storage: cookieStorage,
        }),
      });

export { web3Config };
