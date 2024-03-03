"use client";
import { TimePicker } from "antd";
import cn from "classnames";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { forwardRef } from "react";
import type { Ref, FC, ReactNode } from "react";

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
  suffixIcon?: ReactNode;
  min?: Dayjs;
  error?: string;
  disabled?: boolean;
  onChange?(values: [start: Dayjs | null, end: Dayjs | null]): void;
};

const INPUT_TIME_FORMAT = "HH:mm";

const RangePicker = TimePicker.RangePicker;

const RangeTimeField: FC<PropsWithClassName<Props>> = forwardRef(
  (
    { label, labelPosition = "left", min = dayjs(), className, error, ...rest },
    ref?: Ref<HTMLInputElement>,
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
            className={cn(
              classes.input,

              error && classes.error,
            )}
            popupClassName={classes.picker}
            format={INPUT_TIME_FORMAT}
            separator="—"
            minDate={min}
            changeOnScroll
            allowClear={{
              clearIcon: null,
            }}
            {...rest}
          />
        </ErrorWrapper>
      </LabelWrapper>
    );
  },
);

export { RangeTimeField };
