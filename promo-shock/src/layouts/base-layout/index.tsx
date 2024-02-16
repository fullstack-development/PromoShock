import type { FC, PropsWithChildren } from "react";

import classes from "./base-layout.module.scss";
import { Footer } from "./footer";
import { Header } from "./header";

const BaseLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={classes.root}>
      <Header />
      {children}
      <Footer gutterBottom />
    </div>
  );
};

export { BaseLayout };
