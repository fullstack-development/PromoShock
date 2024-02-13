"use client";
import type { InputRef } from "antd";
import { Input } from "antd";
import { forwardRef } from "react";
import type { Ref, ChangeEventHandler, FC } from "react";

type Props = {
  value?: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  onChange?(value: string): void;
};

const TextField: FC<Props> = forwardRef(
  ({ onChange, ...rest }, ref?: Ref<InputRef>) => {
    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      onChange?.(event.target.value);
    };

    return <Input ref={ref} onChange={handleChange} {...rest} />;
  },
);

export { TextField };
