"use client";
import { TimePicker } from "antd";
import cn from "classnames";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { FC, Ref } from "react";
import { forwardRef } from "react";

import type { PropsWithClassName } from "@promo-shock/shared/types";

import { ErrorWrapper } from "./error-wrapper";
import classes from "./field.module.scss";
import { LabelWrapper } from "./label-wrapper";

type Props = {
  value?: Dayjs;
  label?: string;
  defaultValue?: Dayjs;
  placeholder?: string;
  min?: Dayjs;
  error?: string;
  disabled?: boolean;
  onChange?(value: Dayjs): void;
};

const INPUT_TIME_FORMAT = "HH:mm";

const TimeField: FC<PropsWithClassName<Props>> = forwardRef(
  (
    { label, error, className, min = dayjs(), ...rest },
    ref: Ref<HTMLInputElement>,
  ) => {
    return (
      <LabelWrapper label={label} className={className}>
        <ErrorWrapper message={error}>
          <TimePicker
            ref={ref}
            format={INPUT_TIME_FORMAT}
            className={cn(
              classes.input,
              classes.timepicker,
              error && classes.error,
            )}
            popupClassName={classes.picker}
            minDate={min}
            suffixIcon={false}
            changeOnScroll
            allowClear={{
              clearIcon: false,
            }}
            {...rest}
          />
        </ErrorWrapper>
      </LabelWrapper>
    );
  },
);

export { TimeField };
