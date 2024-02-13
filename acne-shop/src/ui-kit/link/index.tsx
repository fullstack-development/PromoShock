import NextLink from "next/link";
import type { FC, PropsWithChildren } from "react";

import type { PropsWithClassName } from "@acne-shop/shared/types";

type Props = {
  href: string;
  external?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
};

const Link: FC<PropsWithClassName<PropsWithChildren<Props>>> = ({
  children,
  className,
  href,
  external,
  passHref,
  legacyBehavior,
}) => {
  return (
    <NextLink
      href={href}
      passHref={passHref}
      className={className}
      legacyBehavior={legacyBehavior}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </NextLink>
  );
};

export { Link };
