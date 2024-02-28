"use client";
import { DeleteOutlined } from "@ant-design/icons";
import type { ReactElement } from "react";
import type {
  FieldArrayPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { Controller, useFieldArray } from "react-hook-form";

import type { PropsWithClassName } from "@promo-shock/shared/types";

import classes from "./dynamic-fieldset.module.scss";
import { ErrorWrapper } from "./error-wrapper";
import { LabelWrapper } from "./label-wrapper";
import { TextField } from "./text-field";
import { Button } from "../button";
import { TextLink } from "../link";
import { IconTooltip } from "../tooltips";

type Props<T extends FieldValues, K extends FieldArrayPath<T>> = {
  control: UseFormReturn<T>["control"];
  name: T[K] extends Array<infer U>
    ? U extends { value: unknown }
      ? K
      : never
    : never;
  label?: string;
  labelPosition?: "top" | "left";
  errors?: Array<string | undefined>;
  disabled?: boolean;
  placeholder?: string;
  caption?: string;
};

const TOOLTIP_TEXT = (
  <span>
    For targeted promos, just enter the stream ticket address your audience hit
    up. Hover over the stream, click &quot;Copy ticket address&quot;, and paste
    it here. All streams are listed on{" "}
    <TextLink
      className={classes.thisLink}
      title="this"
      href="/streams?filters=all"
    />{" "}
    page.
  </span>
);
const DynamicFieldset = <T extends FieldValues, K extends FieldArrayPath<T>>({
  control,
  name,
  label,
  placeholder,
  errors,
  labelPosition = "left",
  disabled,
  className,
  caption,
}: PropsWithClassName<Props<T, K>>): ReactElement => {
  const fieldset = useFieldArray({ control, name });

  const mkHandleRemove = (index: number) => () => {
    fieldset.remove(index);
  };
  const handleAppend = () => {
    // @ts-expect-error FIXME
    fieldset.append({ value: "" });
  };

  return (
    <LabelWrapper
      label={label}
      labelPosition={labelPosition}
      className={className}
    >
      <ul className={classes.root}>
        {fieldset.fields.map((item, index) => (
          <li key={item.id} className={classes.item}>
            <Controller
              name={`${name}.${index}.value`}
              control={control}
              render={({ field }) => (
                <>
                  <ErrorWrapper message={errors?.[index]}>
                    <TextField
                      placeholder={placeholder}
                      labelPosition="top"
                      disabled={disabled}
                      {...field}
                    />
                  </ErrorWrapper>
                  <button
                    type="button"
                    onClick={mkHandleRemove(index)}
                    className={classes.remove}
                    disabled={disabled}
                  >
                    <DeleteOutlined />
                  </button>
                </>
              )}
            />
          </li>
        ))}

        <div className={classes.controls}>
          <div className={classes.buttonWithTooltip}>
            <div className={classes.append}>
              <Button
                text="Add address"
                theme="tertiary"
                onClick={handleAppend}
                disabled={disabled}
              />
              <span className={classes.caption}>{caption}</span>
            </div>
            <IconTooltip
              icon="info"
              placement="bottomRight"
              title={TOOLTIP_TEXT}
            />
          </div>
        </div>
      </ul>
    </LabelWrapper>
  );
};

export { DynamicFieldset };
