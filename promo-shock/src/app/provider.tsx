"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { DehydratedState } from "@tanstack/react-query";
import { QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import dayjs from "dayjs";
import utcPlugin from "dayjs/plugin/utc";
import type { FC, PropsWithChildren } from "react";
import type { State } from "wagmi";
import { WagmiProvider } from "wagmi";

import { queryClient } from "@promo-shock/configs/query";
import { web3Config } from "@promo-shock/configs/web3";
import { useInitIsMounted } from "@promo-shock/shared/hooks";

type Props = {
  dehydratedState?: DehydratedState;
  web3InitialState?: State;
};

dayjs.extend(utcPlugin);

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
          <RainbowKitProvider modalSize="compact">
            <AntdRegistry>{children}</AntdRegistry>
          </RainbowKitProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export { RootProvider };
