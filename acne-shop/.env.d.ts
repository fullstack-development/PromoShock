/* eslint-disable import/no-unused-modules */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_WC_PROJECT_ID: string;
      NEXT_PUBLIC_BSC_CHAIN_ID: '56' | '97';
      NEXT_PUBLIC_BSC_RPC_URL: string;
      NEXT_PUBLIC_BSC_WS_URL: string;
    }
  }
}

export {};
