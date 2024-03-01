import cn from "classnames";
import type { ComponentProps, FC } from "react";

import { Link } from "./link";
import styles from "./link.module.scss";

type Props = { title: string; underline?: boolean } & Omit<
  ComponentProps<typeof Link>,
  "children"
>;

const TextLink: FC<Props> = ({ title, underline, className, ...props }) => {
  return (
    <Link
      className={cn(className, styles.textLink, {
        [styles.textLink_underline]: underline,
      })}
      {...props}
    >
      {title}
    </Link>
  );
};

export { TextLink };
