"use client";
import { Button as AntdButton } from "antd";
import cn from "classnames";
import { forwardRef } from "react";
import type { MouseEventHandler } from "react";

import styles from "./button.module.scss";
import { Link } from "../link";

type Props = {
  text: string;
  type?: "button" | "submit";
  href?: string;
  size?: "medium" | "big" | "large" | "largeWide" | "small";
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  theme?: "primary" | "secondary" | "tertiary" | "quaternary" | "quinary";
  error?: boolean;
  className?: string;
  fullwidth?: boolean;
};

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      text,
      type = "button",
      disabled,
      href,
      loading,
      onClick,
      className,
      error,
      theme = "primary",
      size = "medium",
      fullwidth,
    },
    ref,
  ) => {
    const button = (
      <AntdButton
        ref={ref}
        htmlType={type}
        disabled={disabled || loading || error}
        href={href}
        onClick={onClick}
        className={cn(className, styles.button, {
          [styles.theme_primary]: theme === "primary",
          [styles.theme_secondary]: theme === "secondary",
          [styles.theme_tertiary]: theme === "tertiary",
          [styles.theme_quaternary]: theme === "quaternary",
          [styles.theme_quinary]: theme === "quinary",
          [styles.size_medium]: size === "medium",
          [styles.size_large]: size === "large",
          [styles.size_largeWide]: size === "largeWide",
          [styles.size_big]: size === "big",
          [styles.size_small]: size === "small",
          [styles.fullwidth]: fullwidth,
          [styles.disabled]: disabled || error,
          [styles.loading]: loading,
          [styles.error]: error,
        })}
      >
        {text}
      </AntdButton>
    );

    return href ? (
      <Link href={href} passHref legacyBehavior>
        {button}
      </Link>
    ) : (
      button
    );
  },
);

export { Button };
