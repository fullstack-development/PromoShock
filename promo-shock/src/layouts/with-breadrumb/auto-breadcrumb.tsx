"use client";
import { usePathname } from "next/navigation";
import type { ComponentProps, FC } from "react";
import React from "react";

import { Breadcrumb } from "@promo-shock/ui-kit";

type Props = Pick<ComponentProps<typeof Breadcrumb>, "includeRoot">;

const AutoBreadcrumb: FC<Props> = ({ includeRoot }) => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((path) => path);

  return (
    <Breadcrumb
      paths={paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        return { href, title: path };
      })}
      includeRoot={includeRoot}
    />
  );
};

export { AutoBreadcrumb };
