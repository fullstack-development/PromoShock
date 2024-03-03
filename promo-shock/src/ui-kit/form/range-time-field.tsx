"use client";
import { useMask } from "@react-input/mask";
import { TimePicker } from "antd";
import cn from "classnames";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { forwardRef } from "react";
import type { Ref, FC, ReactNode } from "react";

import type { PropsWithClassName } from "@promo-shock/shared/types";

import { TIME_FORMAT } from "./constants";
import { ErrorWrapper } from "./error-wrapper";
import classes from "./field.module.scss";
import { LabelWrapper } from "./label-wrapper";

type Props = {
  value?: [Dayjs, Dayjs];
  label?: string;
  labelPosition?: "top" | "left";
  defaultValue?: [Dayjs, Dayjs];
  suffixIcon?: ReactNode;
  min?: Dayjs;
  error?: string;
  disabled?: boolean;
  onChange?(values: [start: Dayjs | null, end: Dayjs | null]): void;
};

const RangePicker = TimePicker.RangePicker;

const RangeTimeField: FC<PropsWithClassName<Omit<Props, "placeholder">>> =
  forwardRef(
    (
      {
        label,
        labelPosition = "left",
        min = dayjs(),
        className,
        error,
        ...rest
      },
      ref?: Ref<HTMLInputElement>,
    ) => {
      const mask_1 = useMask({
        mask: TIME_FORMAT,
        replacement: {
          H: /\d/,
          m: /\d/,
        },
      });
      const mask_2 = useMask({
        mask: TIME_FORMAT,
        replacement: {
          H: /\d/,
          m: /\d/,
        },
      });

      return (
        <LabelWrapper
          label={label}
          labelPosition={labelPosition}
          className={className}
        >
          <ErrorWrapper message={error}>
            <RangePicker
              ref={(target) => {
                if (ref && typeof ref === "function") {
                  ref(target);
                } else if (ref) {
                  // @ts-expect-error RefObject
                  ref.current = target;
                }
                const [input_1 = null, input_2 = null] =
                  target?.nativeElement.querySelectorAll("input") || [];
                mask_1.current = input_1;
                mask_2.current = input_2;
              }}
              className={cn(
                classes.input,

                error && classes.error,
              )}
              placeholder={[
                dayjs().utc(false).format(TIME_FORMAT),
                dayjs().utc(false).add(2, "hour").format(TIME_FORMAT),
              ]}
              popupClassName={classes.picker}
              format={TIME_FORMAT}
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
