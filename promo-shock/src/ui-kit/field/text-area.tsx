"use client";
import { Input } from "antd";
import { forwardRef } from "react";
import type { Ref, ChangeEventHandler, FC } from "react";

type Props = {
  value?: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  onChange?(value: string): void;
};

const { TextArea: AntdTextArea } = Input;

const TextArea: FC<Props> = forwardRef(
  ({ onChange, ...rest }, ref?: Ref<HTMLTextAreaElement>) => {
    const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
      onChange?.(event.target.value);
    };

    return <AntdTextArea ref={ref} onChange={handleChange} {...rest} />;
  },
);

export { TextArea };
