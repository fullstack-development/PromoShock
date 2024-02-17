import type { FC, PropsWithChildren } from "react";

import { WithBreadcrumb } from "@promo-shock/layouts";

const StreamLayout: FC<PropsWithChildren> = (props) => {
  return <WithBreadcrumb>{props.children}</WithBreadcrumb>;
};

export default StreamLayout;
