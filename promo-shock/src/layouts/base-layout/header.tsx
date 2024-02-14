import cn from "classnames";
import type { FC } from "react";

import { WalletButton } from "@promo-shock/components";
import { Logo } from "@promo-shock/ui-kit";

import styles from "./base-layout.module.scss";

type Props = {
  isMirror?: boolean;
};

const Header: FC<Props> = ({ isMirror }) => {
  return (
    <div className={cn(styles.header, { [styles.headerMirror]: isMirror })}>
      <Logo />
      <WalletButton />
    </div>
  );
};

export { Header };
