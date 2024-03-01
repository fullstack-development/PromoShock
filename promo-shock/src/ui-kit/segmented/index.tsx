"use client";
import { Segmented as AntdSegmented } from "antd";
import type { ReactElement } from "react";

type Props<T extends string> = {
  value?: T;
  defaultValue?: T;
  items: Array<{
    value: T;
    label: string;
  }>;
  onChange(value: T): void;
};

const Segmented = <T extends string>({
  items,
  ...rest
}: Props<T>): ReactElement => {
  return <AntdSegmented<T> options={items} {...rest} />;
};

export { Segmented };
