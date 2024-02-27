import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage, http } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";

const bscChains = {
  "56": bsc,
  "97": bscTestnet,
} as const;

const metadata = {
  name: "PromoShock",
  description:
    "Unlock the power of DeSoc: a revolutionary service for seamless streaming and cutting-edge promotions",
  url: "https://promo-shock.vercel.app", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const web3Config = defaultWagmiConfig({
  metadata,
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
  chains: [bscChains[process.env.NEXT_PUBLIC_BSC_CHAIN_ID]],
  transports: {
    [process.env.NEXT_PUBLIC_BSC_CHAIN_ID]: http(
      process.env.NEXT_PUBLIC_BNB_RPC_URL,
    ),
  },
  ssr: true,
  enableEIP6963: false,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export { web3Config };
