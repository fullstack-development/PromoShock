"use client";
import { Button as AntdButton } from "antd";
import type { FC, MouseEventHandler } from "react";

type Props = {
  text: string;
  type?: "button" | "submit";
  size?: "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const Button: FC<Props> = ({
  text,
  type = "button",
  disabled,
  loading,
  onClick,
}) => {
  return (
    <AntdButton
      htmlType={type}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </AntdButton>
  );
};

export { Button };
