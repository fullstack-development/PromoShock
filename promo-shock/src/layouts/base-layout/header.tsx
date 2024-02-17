"use client";

import cn from "classnames";
import { usePathname } from "next/navigation";
import type { FC } from "react";

import { WalletButton } from "@promo-shock/components";
import { Link, Logo, TabLink } from "@promo-shock/ui-kit";

import styles from "./base-layout.module.scss";

type Props = {
  isMirror?: boolean;
  gutterBottom?: boolean;
};

const Header: FC<Props> = ({ isMirror, gutterBottom }) => {
  const pathname = usePathname();
  return (
    <div
      className={cn(
        styles.header,
        { [styles.mirror]: isMirror },
        { [styles.gutterBottom]: gutterBottom },
      )}
    >
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Logo />
        </Link>

        <div className={styles.rightPart}>
          <nav className={styles.nav}>
            <TabLink
              active={pathname.includes("streams")}
              href="/streams"
              text="Streams"
            />
            <TabLink
              active={pathname.includes("promos")}
              href="/promos"
              text="Promo"
            />
          </nav>
          <WalletButton />
        </div>
      </div>
    </div>
  );
};

export { Header };
