"use client";
import { Input } from "antd";
import classNames from "classnames";
import { forwardRef } from "react";
import type { Ref, ChangeEventHandler, FC } from "react";

import type { PropsWithClassName } from "@promo-shock/shared/types";

import { ErrorWrapper } from "./error-wrapper";
import classes from "./field.module.scss";
import { LabelWrapper } from "./label-wrapper";

type Props = {
  value?: string;
  label?: string;
  labelPosition?: "top" | "left";
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
  onChange?(value: string): void;
};

const { TextArea: AntdTextArea } = Input;

const TextArea: FC<PropsWithClassName<Props>> = forwardRef(
  (
    { label, labelPosition = "left", error, className, onChange, ...rest },
    ref?: Ref<HTMLTextAreaElement>,
  ) => {
    const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
      onChange?.(event.target.value);
    };

    return (
      <LabelWrapper
        label={label}
        labelPosition={labelPosition}
        className={className}
      >
        <ErrorWrapper message={error}>
          <AntdTextArea
            ref={ref}
            onChange={handleChange}
            className={classNames(classes.input, classes.textarea)}
            showCount
            {...rest}
          />
        </ErrorWrapper>
      </LabelWrapper>
    );
  },
);

export { TextArea };
