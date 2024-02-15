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

const readFileAsDataURL = (file: File) => {
  const reader = new FileReader();

  const dataURL = new Promise<string>((res, rej) => {
    reader.onload = () => {
      if (typeof reader.result === "string") {
        res(reader.result);
      } else {
        rej("result is not base64 string");
      }
    };
    reader.onerror = () => rej(reader.error);
  });

  reader.readAsDataURL(file);

  return dataURL;
};

export { calculatePercent, trim, stopPropagation, readFileAsDataURL };
