import cn from "classnames";
import NextLink from "next/link";
import type { FC, PropsWithChildren } from "react";

import type { PropsWithClassName } from "@promo-shock/shared/types";

import styles from "./link.module.scss";

type Props = {
  href: string;
  external?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
  underline?: boolean;
};

const Link: FC<PropsWithClassName<PropsWithChildren<Props>>> = ({
  children,
  className,
  href,
  external,
  passHref,
  legacyBehavior,
  underline,
}) => {
  return (
    <NextLink
      href={href}
      passHref={passHref}
      className={cn(className, styles.link, {
        [styles.link_underline]: underline,
      })}
      legacyBehavior={legacyBehavior}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </NextLink>
  );
};

export { Link };
