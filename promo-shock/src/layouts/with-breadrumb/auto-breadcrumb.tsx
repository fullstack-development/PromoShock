"use client";
import { isAddress } from "viem";
import { usePathname } from "next/navigation";
import type { ComponentProps, FC } from "react";
import React from "react";

import { Breadcrumb } from "@promo-shock/ui-kit";

type Props = Pick<ComponentProps<typeof Breadcrumb>, "mapTitle"> & {
  replaceAddressBy?: string;
};

const AutoBreadcrumb: FC<Props> = ({ mapTitle, replaceAddressBy }) => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((path) => path);

  return (
    <Breadcrumb
      paths={paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;

        if (replaceAddressBy && isAddress(path)) {
          return { href, title: replaceAddressBy }
        }

        return { href, title: path.split("-").join(" ") };
      })}
      mapTitle={mapTitle}
    />
  );
};

export { AutoBreadcrumb };
