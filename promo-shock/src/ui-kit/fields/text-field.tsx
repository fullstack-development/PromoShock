"use client";
import type { InputRef } from "antd";
import { Input } from "antd";
import { forwardRef } from "react";
import type { Ref, ChangeEventHandler, FC } from "react";

import type { PropsWithClassName } from "@promo-shock/shared/types";

import { ErrorWrapper } from "./error-wrapper";
import classes from "./field.module.scss";
import { LabelWrapper } from "./label-wrapper";

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

const TextField: FC<PropsWithClassName<Props>> = forwardRef(
  ({ onChange, label, error, className, ...rest }, ref?: Ref<InputRef>) => {
    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      onChange?.(event.target.value);
    };

    return (
      <LabelWrapper label={label} className={className}>
        <ErrorWrapper message={error}>
          <Input
            ref={ref}
            onChange={handleChange}
            className={classes.input}
            {...rest}
          />
        </ErrorWrapper>
      </LabelWrapper>
    );
  },
);

export { TextField };
