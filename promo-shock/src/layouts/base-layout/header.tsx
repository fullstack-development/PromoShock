"use client";

import cn from "classnames";
import { usePathname } from "next/navigation";
import type { FC } from "react";

import { WalletButton } from "@promo-shock/components";
import { Link, Logo, TabLink, TextLink } from "@promo-shock/ui-kit";

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
        <div className={styles.rightPart}>
          <Link href="/" className={styles.logo}>
            <Logo />
          </Link>

          {isMirror && (
            <span>
              Delivered by{" "}
              <TextLink
                title="MetaLamp team"
                href="https://metalamp.io/"
                external
                underline
              />
            </span>
          )}
        </div>

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
            {isMirror && (
              <>
                <TabLink
                  active={pathname.includes("about")}
                  href="/about"
                  text="About"
                />
                <TabLink
                  active={pathname.includes("roadmap")}
                  href="/roadmap"
                  text="Roadmap"
                />
              </>
            )}
          </nav>
          <WalletButton />
        </div>
      </div>
    </div>
  );
};

export { Header };
