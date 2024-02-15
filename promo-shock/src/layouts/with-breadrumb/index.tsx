"use client";
import type { ComponentProps, FC, PropsWithChildren } from "react";

import { AutoBreadcrumb } from "./auto-breadcrumb";

const WithBreadcrumb: FC<
  PropsWithChildren<ComponentProps<typeof AutoBreadcrumb>>
> = ({ children, includeRoot }) => {
  return (
    <div>
      <AutoBreadcrumb includeRoot={includeRoot} />
      {children}
    </div>
  );
};

export { WithBreadcrumb };
