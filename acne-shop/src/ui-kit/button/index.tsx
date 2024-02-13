"use client";
import { Button as AntdButton } from "antd";
import type { FC, ReactNode } from "react";

type Props = {
  text: string;
  type?: "button" | "submit" | "reset";
  size?: "small" | "middle" | "large";
  theme?: "default" | "primary";
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
};

const Button: FC<Props> = ({
  text,
  type = "button",
  size = "middle",
  theme = "default",
  icon,
  disabled,
  loading,
  onClick,
}) => {
  return (
    <AntdButton
      icon={icon}
      type={theme}
      htmlType={type}
      loading={loading}
      size={size}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </AntdButton>
  );
};

export { Button };
