"use client";
import type { FC } from "react";
import ReactFastMarquee from "react-fast-marquee";

type Props = {
  text: string;
  angle?: number; // based on the angle, the marquee (and separator star) will be transformed to the given angle
  direction?: "left" | "right"; // optional implementation
};

const Marquee: FC<Props> = () => {
  return (
    <ReactFastMarquee>
      <span>text</span>
      <span>text</span>
      <span>text</span>
      <span>text</span>
    </ReactFastMarquee>
  );
};

export { Marquee };
