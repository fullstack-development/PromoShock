"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import type { ComponentProps, FC } from "react";
import { useAccount } from "wagmi";

import { trim } from "@promo-shock/shared/utils";
import { Button } from "@promo-shock/ui-kit";

type Props = Pick<ComponentProps<typeof Button>, "size" | "theme">;

const WalletButton: FC<Props> = (props) => {
  const { address } = useAccount();
  const { open } = useWeb3Modal();

  const handleClickWalletButton = () => {
    open();
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
