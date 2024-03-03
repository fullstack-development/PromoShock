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
  value?: [Dayjs, Dayjs];
  label?: string;
  labelPosition?: "top" | "left";
  defaultValue?: [Dayjs, Dayjs];
  min?: Dayjs;
  error?: string;
  disabled?: boolean;
  onChange?(values: [start: Dayjs | null, end: Dayjs | null]): void;
};

const { RangePicker } = DatePicker;

const RangeDateField: FC<PropsWithClassName<Omit<Props, "placeholder">>> =
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
      ref?: Ref<{
        nativeElement: HTMLDivElement;
        focus: () => void;
        blur: () => void;
      }>,
    ) => {
      const mask_1 = useMask({
        mask: DATE_FORMAT,
        replacement: {
          D: /\d/,
          M: /\d/,
          Y: /\d/,
        },
      });
      const mask_2 = useMask({
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
              className={classes.input}
              separator="—"
              minDate={min}
              allowClear={{
                clearIcon: false,
              }}
              placeholder={[
                dayjs().format(DATE_FORMAT),
                dayjs().add(2, "day").format(DATE_FORMAT),
              ]}
              popupClassName={classes.picker}
              suffixIcon={false}
              format="DD.MM.YYYY"
              {...rest}
            />
          </ErrorWrapper>
        </LabelWrapper>
      );
    },
  );

export { RangeDateField };
