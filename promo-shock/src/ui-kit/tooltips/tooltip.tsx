import { Tooltip as AntdTooltip } from "antd";
import type { FC, PropsWithChildren } from "react";

type Props = {
  placement: "top" | "bottom" | "left" | "right";
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
