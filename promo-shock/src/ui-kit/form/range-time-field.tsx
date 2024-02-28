"use client";
import cn from "classnames";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { forwardRef } from "react";
import type { Ref, FC, ChangeEvent } from "react";

import type { PropsWithClassName } from "@promo-shock/shared/types";

import { ErrorWrapper } from "./error-wrapper";
import classes from "./field.module.scss";
import { LabelWrapper } from "./label-wrapper";

type Props = {
  value?: [Dayjs, Dayjs];
  label?: string;
  labelPosition?: "top" | "left";
  defaultValue?: [Dayjs, Dayjs];
  min?: Dayjs;
  error?: string;
  disabled?: boolean;
  onChange?(values: [start: Dayjs | null, end: Dayjs | null]): void;
};

const INPUT_TIME_FORMAT = "HH:mm";

const RangeTimeField: FC<PropsWithClassName<Props>> = forwardRef(
  (
    {
      label,
      labelPosition = "left",
      min = dayjs(),
      className,
      error,
      defaultValue,
      value,
      onChange,
      ...rest
    },
    ref?: Ref<HTMLInputElement>,
  ) => {
    const minValue = min?.format(INPUT_TIME_FORMAT);
    const inputStartValue = value?.[0]?.format(INPUT_TIME_FORMAT) || "";
    const defaultStartInputValue = defaultValue?.[0]?.format(INPUT_TIME_FORMAT);
    const handleStartChange = (event: ChangeEvent<HTMLInputElement>) => {
      const time = event.target.value;
      onChange?.([
        dayjs(time, INPUT_TIME_FORMAT),
        value?.[1] || defaultValue?.[1] || null,
      ]);
    };
    const inputEndValue = value?.[1]?.format(INPUT_TIME_FORMAT) || "";
    const defaultEndInputValue = defaultValue?.[1]?.format(INPUT_TIME_FORMAT);
    const handleEndChange = (event: ChangeEvent<HTMLInputElement>) => {
      const time = event.target.value;
      onChange?.([
        value?.[0] || defaultValue?.[0] || null,
        dayjs(time, INPUT_TIME_FORMAT),
      ]);
    };

    return (
      <LabelWrapper
        label={label}
        labelPosition={labelPosition}
        className={className}
      >
        <ErrorWrapper message={error}>
          <input
            value={inputStartValue}
            onChange={handleStartChange}
            type="time"
            ref={ref}
            className={cn(classes.input, classes.timepicker)}
            defaultValue={defaultStartInputValue}
            min={minValue}
            {...rest}
          />
          {" — "}
          <input
            value={inputEndValue}
            onChange={handleEndChange}
            type="time"
            ref={ref}
            className={cn(classes.input, classes.timepicker)}
            defaultValue={defaultEndInputValue}
            min={minValue}
            {...rest}
          />
        </ErrorWrapper>
      </LabelWrapper>
    );
  },
);

export { RangeTimeField };
