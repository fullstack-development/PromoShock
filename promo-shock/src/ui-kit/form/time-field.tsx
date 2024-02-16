"use client";
import { TimePicker } from "antd";
import type { Dayjs } from "dayjs";
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
  error?: string;
  onChange?(value: Dayjs): void;
};

const TimeField: FC<PropsWithClassName<Props>> = forwardRef(
  (
    { label, error, className, ...rest },
    ref: Ref<{
      nativeElement: HTMLInputElement;
      focus: () => void;
      blur: () => void;
    }>,
  ) => {
    return (
      <LabelWrapper label={label} className={className}>
        <ErrorWrapper message={error}>
          <TimePicker
            ref={ref}
            className={classes.input}
            suffixIcon={false}
            {...rest}
          />
        </ErrorWrapper>
      </LabelWrapper>
    );
  },
);

export { TimeField };
