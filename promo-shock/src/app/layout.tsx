/* eslint-disable import/no-unassigned-import */
import "the-new-css-reset";
import "@rainbow-me/rainbowkit/styles.css";
import cn from "classnames";
import type { Metadata } from "next";
import { Bowlby_One, Bowlby_One_SC, Georama } from "next/font/google";
import localFont from "next/font/local";
import { headers } from "next/headers";
import type { FC, PropsWithChildren } from "react";
import { cookieToInitialState } from "wagmi";

import { web3Config } from "@promo-shock/configs/web3";
import { BaseLayout } from "@promo-shock/layouts";

import { RootProvider } from "./provider";

const bowlbyOne = Bowlby_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bowlby-one",
});
const bowlbyOneSC = Bowlby_One_SC({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bowlby-one-sc",
});
const georama = Georama({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-georama",
});
const W95FA = localFont({ src: "../../public/fonts/W95FA.otf" });

const metadata: Metadata = {
  title: "PromoShock",
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  const web3InitialState = cookieToInitialState(
    web3Config,
    headers().get("cookie"),
  );
  return (
    <html lang="en">
      <body
        className={cn(
          W95FA.className,
          bowlbyOne.variable,
          bowlbyOneSC.variable,
          georama.variable,
        )}
      >
        <RootProvider web3InitialState={web3InitialState}>
          <BaseLayout>{children}</BaseLayout>
        </RootProvider>
      </body>
    </html>
  );
};

export { metadata, bowlbyOne, bowlbyOneSC, georama };
export default RootLayout;
