"use client";
import cn from "classnames";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { ChangeEvent, FC, Ref } from "react";
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
    {
      label,
      error,
      className,
      min = dayjs(),
      value,
      onChange,
      defaultValue,
      ...rest
    },
    ref: Ref<HTMLInputElement>,
  ) => {
    const minValue = min?.format(INPUT_TIME_FORMAT);
    const inputValue = value?.format(INPUT_TIME_FORMAT) || "";
    const defaultInputValue = defaultValue?.format(INPUT_TIME_FORMAT);
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const time = event.target.value;
      onChange?.(dayjs(time, INPUT_TIME_FORMAT));
    };

    return (
      <LabelWrapper label={label} className={className}>
        <ErrorWrapper message={error}>
          <input
            value={inputValue}
            onChange={handleChange}
            type="time"
            ref={ref}
            className={cn(classes.input, classes.timepicker)}
            defaultValue={defaultInputValue}
            min={minValue}
            {...rest}
          />
        </ErrorWrapper>
      </LabelWrapper>
    );
  },
);

export { TimeField };
