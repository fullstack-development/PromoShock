"use client";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import type { ComponentProps, FC } from "react";
import { useAccount, useAccountEffect } from "wagmi";

import { useAuthStore } from "@acne-shop/services";
import { useIsMounted } from "@acne-shop/shared/hooks";
import { trim } from "@acne-shop/shared/utils";
import { Button } from "@acne-shop/ui-kit";

type Props = Pick<ComponentProps<typeof Button>, "size" | "theme">;

const Component: FC<Props> = (props) => {
  const authStore = useAuthStore();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const handleOpen = () => (address ? openAccountModal : openConnectModal)?.();

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
