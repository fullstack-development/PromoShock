"use client";
import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import { forwardRef } from "react";
import type { Ref, FC } from "react";

import type { PropsWithClassName } from "@promo-shock/shared/types";

import { ErrorWrapper } from "./error-wrapper";
import classes from "./field.module.scss";
import { LabelWrapper } from "./label-wrapper";

type Props = {
  value?: [Dayjs, Dayjs];
  label?: string;
  labelPosition?: "top" | "left";
  defaultValue?: [Dayjs, Dayjs];
  placeholder?: [string, string];
  error?: string;
  onChange?(values: [start: Dayjs | null, end: Dayjs | null]): void;
};

const { RangePicker } = DatePicker;

const RangeDateField: FC<PropsWithClassName<Props>> = forwardRef(
  (
    { label, labelPosition = "left", className, error, ...rest },
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
          <RangePicker
            ref={ref}
            className={classes.input}
            suffixIcon={false}
            separator="—"
            {...rest}
          />
        </ErrorWrapper>
      </LabelWrapper>
    );
  },
);

export { RangeDateField };
