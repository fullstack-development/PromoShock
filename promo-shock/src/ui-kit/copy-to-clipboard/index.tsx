"use client";
import type { FC } from "react";
import { useHover } from "react-use";

import { IconCopy } from "./icons";

type Props = {
  message?: string;
  text: string;
};

const CopyToClipboard: FC<Props> = ({ message, text }) => {
  const [children] = useHover(() => <>{message}</>);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button type="button" onClick={handleCopy}>
      <IconCopy />
      {children}
    </button>
  );
};

export { CopyToClipboard };
