"use client";
import type { FC } from "react";

import { WalletButton, AuthButton } from "@acne-shop/components";
import { Link } from "@acne-shop/ui-kit";

import classes from "./base-layout.module.scss";

const Header: FC = () => {
  return (
    <header className={classes.header}>
      <Link href="/">
        <span className={classes.logo}>ACNE SHOP</span>
      </Link>
      <div className={classes.auth}>
        <WalletButton size="large" />
        <AuthButton theme="primary" size="large" />
      </div>
    </header>
  );
};

export { Header };
