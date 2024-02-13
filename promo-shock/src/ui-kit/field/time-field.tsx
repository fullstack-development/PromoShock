"use client";
import { TimePicker } from "antd";
import type { Dayjs } from "dayjs";
import type { FC, Ref } from "react";
import { forwardRef } from "react";

type Props = {
  value?: Dayjs;
  label?: string;
  defaultValue?: Dayjs;
  placeholder?: string;
  error?: string;
  onChange?(value: Dayjs): void;
};

const TimeField: FC<Props> = forwardRef(
  (
    { ...rest },
    ref: Ref<{
      nativeElement: HTMLInputElement;
      focus: () => void;
      blur: () => void;
    }>,
  ) => {
    return <TimePicker ref={ref} {...rest} />;
  },
);

export { TimeField };
