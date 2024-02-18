import { defineConfig, loadEnv } from "@wagmi/cli";
import { actions, react } from "@wagmi/cli/plugins";
import ticketFactoryAbi from './abis/ticket-factory.json';
import promoFactoryAbi from './abis/promo-factory.json';

// @ts-expect-error Abis imported from JSON files
export default defineConfig(() => {
  const env = loadEnv({
    mode: process.env.NODE_ENV,
    envDir: process.cwd(),
  });


  return ({
    out: "generated/wagmi.ts",
    contracts: [
      {
        name: "TicketFactory",
        address: env.NEXT_PUBLIC_BSC_TICKET_FACTORY_ADDRESS,
        abi: ticketFactoryAbi
      },
      {
        name: "PromoFactory",
        address: env.NEXT_PUBLIC_BSC_PROMO_FACTORY_ADDRESS,
        abi: promoFactoryAbi
      },
    ],
    plugins: [
      react(),
      actions()
    ],
  });
});
