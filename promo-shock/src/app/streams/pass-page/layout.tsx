import type { FC, PropsWithChildren } from "react";

import { WithBreadcrumb } from "@promo-shock/layouts";

const StreamsPassLayout: FC<PropsWithChildren> = (props) => {
  return <WithBreadcrumb>{props.children}</WithBreadcrumb>;
};

export default StreamsPassLayout;
