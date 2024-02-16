"use client";
import { Breadcrumb as AntdBreadcrumb } from "antd";
import classNames from "classnames";
import type { FC } from "react";

import classes from "./breadcrumb.module.scss";

type Props = {
  paths: Array<{ href: string; title: string }>;
};

const Breadcrumb: FC<Props> = ({ paths }) => {
  return (
    <AntdBreadcrumb
      className={classes.root}
      items={paths.map((path, i) => ({
        title: path.title,
        href: i === paths.length - 1 ? undefined : path.href,
        className: classNames(classes.item, {
          [classes.current]: i === paths.length - 1,
          [classes.link]: i !== paths.length - 1,
        }),
      }))}
    />
  );
};

export { Breadcrumb };
