"use client";
import { Breadcrumb as AntdBreadcrumb } from "antd";
import type { FC } from "react";

type Props = {
  root: string;
  paths: Array<{ href: string; title: string }>;
};

const Breadcrumb: FC<Props> = ({ root, paths }) => {
  return <AntdBreadcrumb items={[{ title: root }, ...paths]} />;
};

export { Breadcrumb };
