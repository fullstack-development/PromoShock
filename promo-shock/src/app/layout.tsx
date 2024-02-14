/* eslint-disable import/no-unassigned-import */
import "the-new-css-reset";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import type { FC, PropsWithChildren } from "react";

import { BaseLayout } from "@promo-shock/layouts";

import { RootProvider } from "./provider";

const montserrat = Montserrat({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "PromoShock",
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <RootProvider>
          <BaseLayout>{children}</BaseLayout>
        </RootProvider>
      </body>
    </html>
  );
};

export { metadata };
export default RootLayout;
