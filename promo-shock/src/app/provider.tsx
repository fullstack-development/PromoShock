"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { DehydratedState } from "@tanstack/react-query";
import { QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import dayjs from "dayjs";
import utcPlugin from "dayjs/plugin/utc";
import type { FC, PropsWithChildren } from "react";
import type { State } from "wagmi";
import { WagmiProvider } from "wagmi";

import { queryClient } from "@promo-shock/configs/query";
import { web3Config } from "@promo-shock/configs/web3";
import { MessageProvider } from "@promo-shock/services";
import { useInitIsMounted } from "@promo-shock/shared/hooks";

type Props = {
  dehydratedState?: DehydratedState;
  web3InitialState?: State;
};

dayjs.extend(utcPlugin);

createWeb3Modal({
  wagmiConfig: web3Config,
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
  enableAnalytics: false,
  themeMode: "light",
  themeVariables: {
    "--w3m-border-radius-master": "2px",
    "--w3m-accent": "#F759AB",
  },
});

const RootProvider: FC<PropsWithChildren<Props>> = ({
  dehydratedState,
  web3InitialState,
  children,
}) => {
  useInitIsMounted();

  return (
    <WagmiProvider config={web3Config} initialState={web3InitialState}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <AntdRegistry>
            <MessageProvider>{children}</MessageProvider>
          </AntdRegistry>
        </HydrationBoundary>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export { RootProvider };
