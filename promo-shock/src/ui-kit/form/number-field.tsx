"use client";
import { InputNumber } from "antd";
import { forwardRef } from "react";
import type { Ref, FC } from "react";

import type { PropsWithClassName } from "@promo-shock/shared/types";

import { ErrorWrapper } from "./error-wrapper";
import classes from "./field.module.scss";
import { LabelWrapper } from "./label-wrapper";

type Props = {
  value?: number | null;
  label?: string;
  labelPosition?: "top" | "left";
  defaultValue?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  disabled?: boolean;
  onChange?(value: number | null): void;
};

const NumberField: FC<PropsWithClassName<Props>> = forwardRef(
  (
    { label, labelPosition = "left", className, error, ...rest },
    ref?: Ref<HTMLInputElement>,
  ) => {
    return (
      <LabelWrapper
        label={label}
        labelPosition={labelPosition}
        className={className}
      >
        <ErrorWrapper message={error}>
          <InputNumber
            type="number"
            ref={ref}
            className={classes.input}
            controls={false}
            {...rest}
          />
        </ErrorWrapper>
      </LabelWrapper>
    );
  },
);

export { NumberField };
