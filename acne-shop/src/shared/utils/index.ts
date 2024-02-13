import type { MouseEvent } from "react";

const calculatePercent = (percent: number, value: number) => {
  return value * (percent / 100);
};

const trim = (str: string, from: number, to: number) => {
  return `${str.slice(0, from)}...${str.slice(str.length - to, str.length)}`;
};

const stopPropagation = (e: MouseEvent) => {
  e.stopPropagation();
};

export { calculatePercent, trim, stopPropagation };
