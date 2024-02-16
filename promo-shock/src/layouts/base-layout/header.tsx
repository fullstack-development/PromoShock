"use client";

import cn from "classnames";
import type { FC } from "react";

import { WalletButton } from "@promo-shock/components";
import { Logo, TabLink } from "@promo-shock/ui-kit";

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
      <div className={styles.container}>
        <Logo />

        <div className={styles.rightPart}>
          <nav className={styles.nav}>
            <TabLink active href="/CHANGE_ME" text="Streams" />
            <TabLink href="/CHANGE_ME" text="Promo" />
          </nav>
          <WalletButton />
        </div>
      </div>
    </div>
  );
};

export { Header };
