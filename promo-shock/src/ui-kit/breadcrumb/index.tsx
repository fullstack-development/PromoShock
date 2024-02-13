"use client";
import { Breadcrumb as AntdBreadcrumb } from "antd";
import type { FC } from "react";

type Props = {
  paths: Array<{ href: string; title: string }>;
  includeRoot?: boolean;
};

const Breadcrumb: FC<Props> = ({ paths, includeRoot }) => {
  const [root, ...rest] = paths;

  return (
    <AntdBreadcrumb
      items={includeRoot ? [root, ...rest] : [{ title: root.title }, ...rest]}
    />
  );
};

export { Breadcrumb };
