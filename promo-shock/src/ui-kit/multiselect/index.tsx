"use client";
import { Select } from "antd";
import type { ReactElement } from "react";

import classes from "./multiselect.module.scss";

type Props<T> = {
  options: Array<{ label: string; value: T }>;
  value?: Array<T>;
  defaultValue?: Array<T>;
  onChange?(value: Array<T>): void;
};

const Multiselect = <T,>({
  options,
  value,
  defaultValue,
  onChange,
}: Props<T>): ReactElement => {
  return (
    <Select
      mode="multiple"
      value={value}
      className={classes.root}
      popupClassName={classes.popup}
      defaultValue={defaultValue}
      options={options}
      onChange={onChange}
      suffixIcon={null}
      menuItemSelectedIcon={null}
      removeIcon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={10}
          height={10}
          fill="none"
        >
          <path
            fill="#9254DE"
            d="m5.577 5 2.93-3.492a.089.089 0 0 0-.068-.147h-.89a.182.182 0 0 0-.138.064l-2.416 2.88-2.417-2.88a.178.178 0 0 0-.137-.064h-.89a.089.089 0 0 0-.069.147L4.412 5l-2.93 3.492a.089.089 0 0 0 .068.146h.89a.182.182 0 0 0 .138-.063l2.417-2.881 2.416 2.88c.033.04.084.064.137.064h.89a.089.089 0 0 0 .069-.146L5.577 5Z"
          />
        </svg>
      }
    />
  );
};

export { Multiselect };
