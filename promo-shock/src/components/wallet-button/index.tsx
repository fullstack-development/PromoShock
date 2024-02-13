"use client";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import type { ComponentProps, FC } from "react";
import { useAccount, useAccountEffect } from "wagmi";

import { useAuthStore } from "@promo-shock/services";
import { useIsMounted } from "@promo-shock/shared/hooks";
import { trim } from "@promo-shock/shared/utils";
import { Button } from "@promo-shock/ui-kit";

type Props = Pick<ComponentProps<typeof Button>, "size">;

const Component: FC<Props> = (props) => {
  const authStore = useAuthStore();
  const { address } = useAccount();
  const { openConnectModal = () => void 0 } = useConnectModal();
  const { openAccountModal = () => void 0 } = useAccountModal();

  const handleOpen = () => {
    if (address) {
      openAccountModal();
    } else {
      openConnectModal();
    }
  };

  useAccountEffect({
    onDisconnect: authStore.signOut,
  });

  return (
    <Button
      text={address ? trim(address, 5, 5) : "Connect"}
      onClick={handleOpen}
      {...props}
    />
  );
};

const WalletButton: FC<Props> = (props) => {
  const isMounted = useIsMounted();

  return isMounted && <Component {...props} />;
};

export { WalletButton };
