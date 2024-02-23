"use client";
import type { ComponentProps, FC, PropsWithChildren } from "react";

import { AutoBreadcrumb } from "./auto-breadcrumb";
import classes from "./with-breadcrumb.module.scss";

type Props = ComponentProps<typeof AutoBreadcrumb>;

const WithBreadcrumb: FC<PropsWithChildren<Props>> = ({
  children,
  tailTitle,
}) => {
  return (
    <div className={classes.root}>
      <div className={classes.breadcrumb}>
        <AutoBreadcrumb tailTitle={tailTitle} />
      </div>
      {children}
    </div>
  );
};

export { WithBreadcrumb };
