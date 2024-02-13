import type { ComponentProps, FC } from "react";

import { Link } from "./link";

type Props = { title: string } & Omit<ComponentProps<typeof Link>, "children">;

const TextLink: FC<Props> = ({ title, ...props }) => {
  return <Link {...props}>{title}</Link>;
};

export { TextLink };
