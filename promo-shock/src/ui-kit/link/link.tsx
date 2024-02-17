"use client";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import type { FC, PropsWithChildren } from "react";

// eslint-disable-next-line import/no-restricted-paths
import { useConfirmLeaveMessage } from "@promo-shock/services";
import type { PropsWithClassName } from "@promo-shock/shared/types";

import { Popconfirm } from "../popconfirm";

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
  className,
  ...rest
}) => {
  const [enabled, message] = useConfirmLeaveMessage();
  const router = useRouter();

  const handleConfirmLeave = () => {
    router.push(href);
  };

  return enabled ? (
    <Popconfirm message={message} onOk={handleConfirmLeave}>
      <button type="button" className={className}>
        {children}
      </button>
    </Popconfirm>
  ) : (
    <NextLink
      href={href}
      className={className}
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
