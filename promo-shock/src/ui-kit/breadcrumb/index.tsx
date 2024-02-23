"use client";
import { Breadcrumb as AntdBreadcrumb } from "antd";
import classNames from "classnames";
import type { FC } from "react";

import classes from "./breadcrumb.module.scss";
import { Link } from "../link";

type Props = {
  paths: Array<{ href: string; title: string }>;
};

const Item: FC<{
  href: string;
  title: string;
  last?: boolean;
}> = ({ href, title, last }) => {
  return last ? (
    <span
      className={classNames(classes.item, {
        [classes.current]: last,
        [classes.link]: !last,
      })}
    >
      {title}
    </span>
  ) : (
    <Link
      href={href}
      className={classNames(classes.item, {
        [classes.current]: last,
        [classes.link]: !last,
      })}
    >
      {title}
    </Link>
  );
};

const Breadcrumb: FC<Props> = ({ paths }) => {
  return (
    <AntdBreadcrumb
      className={classes.root}
      items={paths.map(({ title, href }, i) => ({
        title: (
          <Item
            key={i + href}
            href={href}
            title={title}
            last={i === paths.length - 1}
          />
        ),
      }))}
    />
  );
};

export { Breadcrumb };
