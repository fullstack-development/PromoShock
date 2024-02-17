"use client";
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
import { IconDelete } from "./icons";
import { LabelWrapper } from "./label-wrapper";
import { TextField } from "./text-field";
import { Button } from "../button";

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
  placeholder?: string;
};

const DynamicFieldset = <T extends FieldValues, K extends FieldArrayPath<T>>({
  control,
  name,
  label,
  placeholder,
  errors,
  labelPosition = "left",
  className,
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
              render={({ field }) =>
                index === fieldset.fields.length - 1 ? (
                  <>
                    <ErrorWrapper message={errors?.[errors.length - 1]}>
                      <TextField
                        placeholder={placeholder}
                        labelPosition="top"
                        {...field}
                      />
                    </ErrorWrapper>
                    <Button
                      text="Add more"
                      theme="tertiary"
                      onClick={handleAppend}
                    />
                  </>
                ) : (
                  <>
                    <ErrorWrapper message={errors?.[index]}>
                      <TextField
                        placeholder={placeholder}
                        labelPosition="top"
                        {...field}
                      />
                    </ErrorWrapper>
                    <button
                      type="button"
                      onClick={mkHandleRemove(index)}
                      className={classes.remove}
                    >
                      <IconDelete />
                    </button>
                  </>
                )
              }
            />
          </li>
        ))}
      </ul>
    </LabelWrapper>
  );
};

export { DynamicFieldset };
