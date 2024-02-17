"use client";
import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { forwardRef } from "react";
import type { Ref, FC } from "react";

import type { PropsWithClassName } from "@promo-shock/shared/types";

import { ErrorWrapper } from "./error-wrapper";
import classes from "./field.module.scss";
import { LabelWrapper } from "./label-wrapper";

type Props = {
  value?: Dayjs;
  label?: string;
  labelPosition?: "top" | "left";
  defaultValue?: Dayjs;
  placeholder?: string;
  min?: Dayjs;
  error?: string;
  onChange?(value: Dayjs): void;
};

const DateField: FC<PropsWithClassName<Props>> = forwardRef(
  (
    { label, labelPosition = "left", className, error, min = dayjs(), ...rest },
    ref?: Ref<{
      nativeElement: HTMLInputElement;
      focus: () => void;
      blur: () => void;
    }>,
  ) => {
    return (
      <LabelWrapper
        label={label}
        labelPosition={labelPosition}
        className={className}
      >
        <ErrorWrapper message={error}>
          <DatePicker
            ref={ref}
            className={classes.input}
            suffixIcon={false}
            minDate={min}
            {...rest}
          />
        </ErrorWrapper>
      </LabelWrapper>
    );
  },
);

export { DateField };
