"use client";
import { Button as AntdButton } from "antd";
import cn from "classnames";
import type { FC, MouseEventHandler } from "react";

import styles from "./button.module.scss";

type Props = {
  text: string;
  type?: "button" | "submit";
  size?: "medium" | "large" | "largeWide";
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  theme?: "primary" | "secondary" | "tertiary";
  className?: string;
};

const Button: FC<Props> = ({
  text,
  type = "button",
  disabled,
  loading,
  onClick,
  className,
  theme = "primary",
  size = "medium",
}) => {
  return (
    <AntdButton
      htmlType={type}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      className={cn(className, styles.button, {
        [styles.theme_primary]: theme === "primary",
        [styles.theme_secondary]: theme === "secondary",
        [styles.theme_tertiary]: theme === "tertiary",
        [styles.size_default]: size === "medium",
        [styles.size_large]: size === "large",
        [styles.size_largeWide]: size === "largeWide",
      })}
    >
      {text}
    </AntdButton>
  );
};

export { Button };