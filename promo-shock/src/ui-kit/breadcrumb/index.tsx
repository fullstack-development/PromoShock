"use client";
import { Breadcrumb as AntdBreadcrumb } from "antd";
import classNames from "classnames";
import { useState, useEffect } from "react";
import type { FC } from "react";

import classes from "./breadcrumb.module.scss";
import { Link } from "../link";

type Props = {
  paths: Array<{ href: string; title: string }>;
  mapTitle?: (title: string) => string | Promise<string>;
};

const Item: FC<{
  href: string;
  title: string;
  mapTitle?: (title: string) => string | Promise<string>;
  last?: boolean;
}> = ({ href, title, last, mapTitle = (x) => x }) => {
  const [_title, setTitle] = useState(title);

  useEffect(() => {
    let canceled = false;
    const mappedTitle = mapTitle(title);

    if (mappedTitle instanceof Promise) {
      mappedTitle.then((res) => {
        if (!canceled) setTitle(res);
      });
    } else {
      setTitle(mappedTitle);
    }

    return () => {
      canceled = true;
    };
  }, [title, mapTitle]);

  return last ? (
    <span
      className={classNames(classes.item, {
        [classes.current]: last,
        [classes.link]: !last,
      })}
    >
      {_title}
    </span>
  ) : (
    <Link
      href={href}
      className={classNames(classes.item, {
        [classes.current]: last,
        [classes.link]: !last,
      })}
    >
      {_title}
    </Link>
  );
};

const Breadcrumb: FC<Props> = ({ paths, mapTitle }) => {
  return (
    <AntdBreadcrumb
      className={classes.root}
      items={paths.map((path, i) => ({
        title: (
          <Item {...path} last={i === paths.length - 1} mapTitle={mapTitle} />
        ),
      }))}
    />
  );
};

export { Breadcrumb };
