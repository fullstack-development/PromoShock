"use client";
import type { FC, PropsWithChildren } from "react";

import { AutoBreadcrumb } from "./auto-breadcrumb";
import classes from "./with-breadcrumb.module.scss";

const WithBreadcrumb: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={classes.root}>
      <div className={classes.breadcrumb}>
        <AutoBreadcrumb />
      </div>
      {children}
    </div>
  );
};

export { WithBreadcrumb };
