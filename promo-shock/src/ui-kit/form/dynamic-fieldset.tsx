"use client";
import type { ReactElement, ReactNode, Ref } from "react";
import type {
  FieldArrayPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { Controller, useFieldArray } from "react-hook-form";

import type { PropsWithClassName } from "@promo-shock/shared/types";

import classes from "./dynamic-fieldset.module.scss";
import { ErrorWrapper } from "./error-wrapper";
import { IconDelete } from "./icons/icon-delete";
import { LabelWrapper } from "./label-wrapper";
import { TextField } from "./text-field";
import { Button } from "../button";
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
  addMoreText?: string;
  addMoreTooltipContent?: ReactNode;
  addMoreCaption?: string;
  uploadCSVTooltipContent?: ReactNode;
  errors?: Array<string | undefined>;
  disabled?: boolean;
  placeholder?: string;
  addMoreRef?: Ref<HTMLButtonElement>;
};

const DynamicFieldset = <T extends FieldValues, K extends FieldArrayPath<T>>({
  control,
  name,
  label,
  placeholder,
  errors,
  labelPosition = "left",
  disabled,
  className,
  addMoreRef,
  addMoreText = "Add more",
  addMoreCaption,
  addMoreTooltipContent,
  uploadCSVTooltipContent,
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
                    <IconDelete />
                  </button>
                </>
              )}
            />
          </li>
        ))}

        <div className={classes.controls}>
          <div className={classes.buttonWithTooltip}>
            <div className={classes.append}>
              <Button text="Upload.csv" theme="tertiary" disabled />
            </div>
            {uploadCSVTooltipContent && (
              <IconTooltip
                icon="info"
                placement="bottomRight"
                title={uploadCSVTooltipContent}
              />
            )}
          </div>
          <div className={classes.buttonWithTooltip}>
            <div className={classes.append}>
              <Button
                ref={addMoreRef}
                text={addMoreText}
                theme="tertiary"
                onClick={handleAppend}
                disabled={disabled}
              />
              <span className={classes.caption}>{addMoreCaption}</span>
            </div>
            {addMoreTooltipContent && (
              <IconTooltip
                icon="info"
                placement="bottomRight"
                title={addMoreTooltipContent}
              />
            )}
          </div>
        </div>
      </ul>
    </LabelWrapper>
  );
};

export { DynamicFieldset };
