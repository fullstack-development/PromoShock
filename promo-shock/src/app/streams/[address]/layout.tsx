import type { FC, PropsWithChildren } from "react";

import { WithBreadcrumb } from "@promo-shock/layouts";

const StreamLayout: FC<PropsWithChildren> = ({ children }) => {
  return <WithBreadcrumb>{children}</WithBreadcrumb>;
};

export default StreamLayout;
