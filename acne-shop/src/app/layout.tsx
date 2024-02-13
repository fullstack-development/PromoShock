/* eslint-disable import/no-unassigned-import */
import "the-new-css-reset";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { BaseLayout } from "@acne-shop/layouts";

import { RootProvider } from "./provider";

const montserrat = Montserrat({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "AcneShop",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <RootProvider>
          <BaseLayout>{children}</BaseLayout>
        </RootProvider>
      </body>
    </html>
  );
}

export { metadata };
export default RootLayout;
