import type { ComponentProps, FC } from "react";

import { Link } from "./link";

type Props = { text: string } & Omit<ComponentProps<typeof Link>, "children">;

const TabLink: FC<Props> = ({ text, ...props }) => {
  return <Link {...props}>{text}</Link>;
};

export { TabLink };
