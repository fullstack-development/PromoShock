"use client";
import { useMask } from "@react-input/mask";
import { TimePicker } from "antd";
import cn from "classnames";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { FC, Ref } from "react";
import { forwardRef } from "react";

import type { PropsWithClassName } from "@promo-shock/shared/types";

import { TIME_FORMAT } from "./constants";
import { ErrorWrapper } from "./error-wrapper";
import classes from "./field.module.scss";
import { LabelWrapper } from "./label-wrapper";

type Props = {
  value?: Dayjs;
  label?: string;
  defaultValue?: Dayjs;
  min?: Dayjs;
  error?: string;
  disabled?: boolean;
  onChange?(value: Dayjs): void;
};

const TimeField: FC<PropsWithClassName<Props>> = forwardRef(
  (
    { label, error, className, min = dayjs(), ...rest },
    ref: Ref<HTMLInputElement>,
  ) => {
    const mask = useMask({
      mask: TIME_FORMAT,
      replacement: {
        H: /\d/,
        m: /\d/,
      },
    });
    return (
      <LabelWrapper label={label} className={className}>
        <ErrorWrapper message={error}>
          <TimePicker
            ref={(target) => {
              if (ref && typeof ref === "function") {
                ref(target);
              } else if (ref) {
                // @ts-expect-error RefObject
                ref.current = target;
              }
              mask.current =
                target?.nativeElement.querySelector("input") || null;
            }}
            format={TIME_FORMAT}
            className={cn(
              classes.input,
              classes.timepicker,
              error && classes.error,
            )}
            popupClassName={classes.picker}
            placeholder={dayjs().utc(false).format(TIME_FORMAT)}
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
