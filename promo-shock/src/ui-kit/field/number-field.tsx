"use client";
import type { InputRef } from "antd";
import { Input } from "antd";
import { forwardRef } from "react";
import type { Ref, ChangeEventHandler, FC } from "react";

type Props = {
  value?: number;
  label?: string;
  defaultValue?: number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  onChange?(value: number): void;
};

const NumberField: FC<Props> = forwardRef(
  ({ onChange, ...rest }, ref?: Ref<InputRef>) => {
    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      onChange?.(Number(event.target.value));
    };

    return <Input ref={ref} onChange={handleChange} {...rest} />;
  },
);

export { NumberField };
