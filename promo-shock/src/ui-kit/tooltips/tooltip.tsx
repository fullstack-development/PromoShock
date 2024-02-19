import { Tooltip as AntdTooltip } from "antd";
import type { FC, PropsWithChildren } from "react";

import type { TooltipPlacement } from "../types";

type Props = {
  placement: TooltipPlacement;
  title: string;
};

const Tooltip: FC<PropsWithChildren<Props>> = ({
  placement,
  title,
  children,
}) => {
  return (
    <AntdTooltip placement={placement} title={title}>
      {children}
    </AntdTooltip>
  );
};

export { Tooltip };
