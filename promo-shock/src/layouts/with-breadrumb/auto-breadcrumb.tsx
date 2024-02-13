"use client";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import React from "react";

import { Breadcrumb } from "@promo-shock/ui-kit";

const AutoBreadcrumb: FC = () => {
  const pathname = usePathname();
  const [root, ...paths] = pathname.split("/").filter((path) => path);

  return (
    <Breadcrumb
      root={root}
      paths={paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        return { href, title: path };
      })}
    />
  );
};

export { AutoBreadcrumb };
