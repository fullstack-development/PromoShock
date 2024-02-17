import type { ComponentProps, FC } from "react";

import { IconInfo } from "./icons";
import { Tooltip } from "./tooltip";

type Props = {
  icon: "info";
} & Omit<ComponentProps<typeof Tooltip>, "children">;

const IconTooltip: FC<Props> = ({ icon, ...rest }) => {
  const renderIcon = () => {
    switch (icon) {
      case "info":
        return <IconInfo />;
      default:
        return null;
    }
  };
  return <Tooltip {...rest}>{renderIcon()}</Tooltip>;
};
export { IconTooltip };
