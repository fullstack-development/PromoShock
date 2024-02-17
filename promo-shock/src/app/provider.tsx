"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import type { FC, PropsWithChildren } from "react";
import type { State } from "wagmi";
import { WagmiProvider } from "wagmi";

import { queryClient } from "@promo-shock/configs/query";
import { web3Config } from "@promo-shock/configs/web3";
import { useInitIsMounted } from "@promo-shock/shared/hooks";

type Props = {
  web3InitialState?: State;
};

const RootProvider: FC<PropsWithChildren<Props>> = ({
  web3InitialState,
  children,
}) => {
  useInitIsMounted();

  return (
    <WagmiProvider config={web3Config} initialState={web3InitialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">
          <AntdRegistry>{children}</AntdRegistry>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export { RootProvider };
