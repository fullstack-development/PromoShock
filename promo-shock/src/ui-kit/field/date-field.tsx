"use client";
import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import { forwardRef } from "react";
import type { Ref, FC } from "react";

type Props = {
  value?: Dayjs;
  label?: string;
  defaultValue?: Dayjs;
  placeholder?: string;
  error?: string;
  onChange?(value: Dayjs): void;
};

const DateField: FC<Props> = forwardRef(
  (
    { ...rest },
    ref?: Ref<{
      nativeElement: HTMLInputElement;
      focus: () => void;
      blur: () => void;
    }>,
  ) => {
    return <DatePicker ref={ref} {...rest} />;
  },
);

export { DateField };
