'use client';

import cn from "classnames";
import type { FC } from "react";

import { WalletButton } from "@promo-shock/components";
import { Logo } from "@promo-shock/ui-kit";

import styles from "./base-layout.module.scss";

type Props = {
  isMirror?: boolean;
  gutterBottom?: boolean;
};

const Header: FC<Props> = ({ isMirror, gutterBottom }) => {
  return (
    <div
      className={cn(
        styles.header,
        { [styles.mirror]: isMirror },
        { [styles.gutterBottom]: gutterBottom },
      )}
    >
      <Logo />
      <WalletButton />
    </div>
  );
};

export { Header };
