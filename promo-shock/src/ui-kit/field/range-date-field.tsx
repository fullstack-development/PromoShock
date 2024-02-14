"use client";
import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import { forwardRef } from "react";
import type { Ref, FC } from "react";

type Props = {
  value?: [Dayjs, Dayjs];
  label?: string;
  defaultValue?: [Dayjs, Dayjs];
  placeholder?: [string, string];
  error?: string;
  onChange?(values: [start: Dayjs | null, end: Dayjs | null]): void;
};

const { RangePicker } = DatePicker;

const RangeDateField: FC<Props> = forwardRef(
  (
    { ...rest },
    ref?: Ref<{
      nativeElement: HTMLInputElement;
      focus: () => void;
      blur: () => void;
    }>,
  ) => {
    return <RangePicker ref={ref} {...rest} />;
  },
);

export { RangeDateField };
