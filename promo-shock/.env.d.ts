/* eslint-disable import/no-unused-modules */
declare global {
  import type { Address } from 'viem';
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_WC_PROJECT_ID: string;
      NEXT_PUBLIC_BSC_CHAIN_ID: '56' | '97';
      NEXT_PUBLIC_BSC_RPC_URL: string;
      NEXT_PUBLIC_BSC_TICKET_FACTORY_ADDRESS: Address;
      NEXT_PUBLIC_BSC_PROMO_FACTORY_ADDRESS: Address;
      NEXT_PUBLIC_ETHERSCAN_API_KEY: string;
      NEXT_PUBLIC_BSC_PAYMENT_TOKEN_ADDRESS: Address;
      NEXT_PUBLIC_METADATA_EXTERNAL_LINK: string;
    }
  }
}

export {};
