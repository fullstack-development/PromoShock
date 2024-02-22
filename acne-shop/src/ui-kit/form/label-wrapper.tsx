import classNames from "classnames";
import type { FC, PropsWithChildren } from "react";

import type { PropsWithClassName } from "@acne-shop/shared/types";

import classes from "./field.module.scss";

type Props = {
  label?: string;
  labelPosition?: "top" | "left";
};

const LabelWrapper: FC<PropsWithClassName<PropsWithChildren<Props>>> = ({
  children,
  label,
  labelPosition = "left",
  className,
}) => {
  return (
    <div
      className={classNames(className, classes.label_wrap, {
        [classes.label_top]: labelPosition === "top",
      })}
    >
      {label && <span className={classes.label_text}>{label}</span>}
      {children}
    </div>
  );
};

export { LabelWrapper };
