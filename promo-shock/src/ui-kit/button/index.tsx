"use client";
import { Button as AntdButton } from "antd";
import cn from "classnames";
import type { FC, MouseEventHandler } from "react";

import styles from "./button.module.scss";

type Props = {
  text: string;
  type?: "button" | "submit";
  size?: "medium" | "big" | "large" | "largeWide";
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  theme?: "primary" | "secondary" | "tertiary" | "quaternary";
  error?: boolean;
  className?: string;
};

const Button: FC<Props> = ({
  text,
  type = "button",
  disabled,
  loading,
  onClick,
  className,
  error,
  theme = "primary",
  size = "medium",
}) => {
  return (
    <AntdButton
      htmlType={type}
      disabled={disabled || loading || error}
      onClick={onClick}
      className={cn(className, styles.button, {
        [styles.theme_primary]: theme === "primary",
        [styles.theme_secondary]: theme === "secondary",
        [styles.theme_tertiary]: theme === "tertiary",
        [styles.theme_quaternary]: theme === "quaternary",
        [styles.size_medium]: size === "medium",
        [styles.size_large]: size === "large",
        [styles.size_largeWide]: size === "largeWide",
        [styles.size_big]: size === "big",
        [styles.disabled]: disabled,
        [styles.loading]: loading,
        [styles.error]: error,
      })}
    >
      {text}
    </AntdButton>
  );
};

export { Button };
