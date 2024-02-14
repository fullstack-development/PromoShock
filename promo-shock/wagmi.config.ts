import { defineConfig, loadEnv } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { etherscan } from "@wagmi/cli/plugins";

export default defineConfig(() => {
  const env = loadEnv({
    mode: process.env.NODE_ENV,
    envDir: process.cwd(),
  })

  return ({
    out: "generated/wagmi.ts",
    plugins: [
      react(),
      etherscan({
        apiKey: env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
        chainId: env.NEXT_PUBLIC_BSC_CHAIN_ID as any,
        contracts: [
          {
            name: "TicketFactory",
            address: {
              [env.NEXT_PUBLIC_BSC_CHAIN_ID as any]:
                env.NEXT_PUBLIC_BSC_TICKET_FACTORY_ADDRESS as any,
            },
          },
          {
            name: "PromoFactory",
            address: {
              [env.NEXT_PUBLIC_BSC_CHAIN_ID as any]:
                env.NEXT_PUBLIC_BSC_PROMO_FACTORY_ADDRESS as any,
            },
          },
        ],
      }),
    ],
  });
});
