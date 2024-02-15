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
  defaultValue?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  onChange?(value: number | null): void;
};

const NumberField: FC<PropsWithClassName<Props>> = forwardRef(
  ({ label, className, error, ...rest }, ref?: Ref<HTMLInputElement>) => {
    return (
      <LabelWrapper label={label} className={className}>
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
