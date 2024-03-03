"use client";
import { useMask } from "@react-input/mask";
import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { forwardRef } from "react";
import type { Ref, FC } from "react";

import type { PropsWithClassName } from "@promo-shock/shared/types";

import { DATE_FORMAT } from "./constants";
import { ErrorWrapper } from "./error-wrapper";
import classes from "./field.module.scss";
import { LabelWrapper } from "./label-wrapper";

type Props = {
  value?: Dayjs;
  label?: string;
  labelPosition?: "top" | "left";
  defaultValue?: Dayjs;
  min?: Dayjs;
  error?: string;
  disabled?: boolean;
  onChange?(value: Dayjs): void;
};

const DateField: FC<PropsWithClassName<Props>> = forwardRef(
  (
    { label, labelPosition = "left", className, error, min = dayjs(), ...rest },
    ref?: Ref<{
      nativeElement: HTMLDivElement;
      focus: () => void;
      blur: () => void;
    }>,
  ) => {
    const mask = useMask({
      mask: DATE_FORMAT,
      replacement: {
        D: /\d/,
        M: /\d/,
        Y: /\d/,
      },
    });
    return (
      <LabelWrapper
        label={label}
        labelPosition={labelPosition}
        className={className}
      >
        <ErrorWrapper message={error}>
          <DatePicker
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
            className={classes.input}
            suffixIcon={false}
            allowClear={{
              clearIcon: false,
            }}
            placeholder={dayjs().utc(false).format(DATE_FORMAT)}
            popupClassName={classes.picker}
            minDate={min}
            format={DATE_FORMAT}
            {...rest}
          />
        </ErrorWrapper>
      </LabelWrapper>
    );
  },
);

export { DateField };
