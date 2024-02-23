"use client";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import type { ComponentProps, FC } from "react";
import { useAccount, useAccountEffect } from "wagmi";

import { useAuthStore } from "@promo-shock/services";
import { trim } from "@promo-shock/shared/utils";
import { Button } from "@promo-shock/ui-kit";

type Props = Pick<ComponentProps<typeof Button>, "size" | "theme">;

const WalletButton: FC<Props> = (props) => {
  const authStore = useAuthStore();
  const { address } = useAccount();
  const { openConnectModal = () => void 0 } = useConnectModal();
  const { openAccountModal = () => void 0 } = useAccountModal();

  useAccountEffect({
    onDisconnect: authStore.signOut,
  });

  const handleClickWalletButton = () => {
    if (address) {
      openAccountModal();
    } else {
      openConnectModal();
    }
  };

  return (
    <Button
      text={address ? trim(address, 5, 5) : "Connect wallet"}
      onClick={handleClickWalletButton}
      theme="primary"
      size="medium"
      {...props}
    />
  );
};

export { WalletButton };
