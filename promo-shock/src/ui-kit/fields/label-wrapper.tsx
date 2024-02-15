import classNames from "classnames";
import type { FC, PropsWithChildren } from "react";

import type { PropsWithClassName } from "@promo-shock/shared/types";

import classes from "./field.module.scss";

type Props = {
  label?: string;
};

const LabelWrapper: FC<PropsWithClassName<PropsWithChildren<Props>>> = ({
  children,
  label,
  className,
}) => {
  return (
    <label className={classNames(className, classes.label_wrap)}>
      {label && <span className={classes.label_text}>{label}</span>}
      {children}
    </label>
  );
};

export { LabelWrapper };
