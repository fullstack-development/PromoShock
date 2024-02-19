"use client";
import type { ComponentProps, FC, PropsWithChildren } from "react";

import { AutoBreadcrumb } from "./auto-breadcrumb";
import classes from "./with-breadcrumb.module.scss";

type Props = ComponentProps<typeof AutoBreadcrumb>;

const WithBreadcrumb: FC<PropsWithChildren<Props>> = ({
  children,
  mapTitle,
}) => {
  return (
    <div className={classes.root}>
      <div className={classes.breadcrumb}>
        <AutoBreadcrumb mapTitle={mapTitle} />
      </div>
      {children}
    </div>
  );
};

export { WithBreadcrumb };
