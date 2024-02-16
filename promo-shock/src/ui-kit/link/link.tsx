import NextLink from "next/link";
import type { FC, PropsWithChildren } from "react";

import type { PropsWithClassName } from "@promo-shock/shared/types";

type Props = {
  href: string;
  external?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
};

const Link: FC<PropsWithClassName<PropsWithChildren<Props>>> = ({
  children,
  href,
  external,
  passHref,
  legacyBehavior,
  ...rest
}) => {
  return (
    <NextLink
      href={href}
      passHref={passHref}
      legacyBehavior={legacyBehavior}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </NextLink>
  );
};

export { Link };
