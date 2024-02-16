import type { FC, PropsWithChildren } from "react";

import classes from "./field.module.scss";

type Props = {
  message?: string;
};

const ErrorWrapper: FC<PropsWithChildren<Props>> = ({ children, message }) => {
  return (
    <div className={classes.error_wrap}>
      {children}
      {message && <span className={classes.error_message}>{message}</span>}
    </div>
  );
};

export { ErrorWrapper };
