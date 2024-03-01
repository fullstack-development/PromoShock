"use client";
import { Popconfirm as AntdPopconfirm } from "antd";
import classNames from "classnames";
import type { FC, PropsWithChildren } from "react";

import classes from "./popconfirm.module.scss";
import buttonClasses from "../button/button.module.scss";

type Props = {
  message?: string;
  onOk?(): void;
};

const Popconfirm: FC<PropsWithChildren<Props>> = ({
  message = "Are you sure?",
  children,
  onOk,
}) => {
  return (
    <AntdPopconfirm
      rootClassName={classes.root}
      title={message}
      icon={null}
      onConfirm={onOk}
      okText="Yes"
      cancelText="No"
      okButtonProps={{
        className: classNames(
          buttonClasses.button,
          buttonClasses.theme_primary,
          buttonClasses.size_small,
          classes.button,
        ),
      }}
      cancelButtonProps={{
        className: classNames(
          buttonClasses.button,
          buttonClasses.theme_quinary,
          buttonClasses.size_small,
          classes.button,
        ),
      }}
    >
      {children}
    </AntdPopconfirm>
  );
};

export { Popconfirm };
