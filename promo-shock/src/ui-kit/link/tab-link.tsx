import cn from "classnames";
import type { ComponentProps, FC } from "react";

import { Link } from "./link";
import styles from "./link.module.scss";

type Props = { text: string; active?: boolean } & Omit<
  ComponentProps<typeof Link>,
  "children"
>;

const TabLink: FC<Props> = ({ text, active, className, ...props }) => {
  return (
    <Link
      className={cn(className, styles.tabLink, {
        [styles.tabLink_active]: active,
      })}
      {...props}
    >
      {text}
    </Link>
  );
};

export { TabLink };
