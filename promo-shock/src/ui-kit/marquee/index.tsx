"use client";
import type { FC } from "react";
import ReactFastMarquee from "react-fast-marquee";

type Props = {
  text: React.ReactNode;
  direction: "left" | "right";
};

const Marquee: FC<Props> = ({ text, direction }) => {
  return (
    <ReactFastMarquee direction={direction}>
      <span>{text}</span>
      <span>{text}</span>
      <span>{text}</span>
      <span>{text}</span>
      <span>{text}</span>
      <span>{text}</span>
      <span>{text}</span>
      <span>{text}</span>
    </ReactFastMarquee>
  );
};

export { Marquee };
