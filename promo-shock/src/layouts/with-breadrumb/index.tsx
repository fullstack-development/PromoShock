import type { FC, PropsWithChildren } from "react";

import { AutoBreadcrumb } from "./auto-breadcrumb";

const WithBreadcrumb: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <AutoBreadcrumb />
      {children}
    </div>
  );
};

export { WithBreadcrumb };
