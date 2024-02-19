"use client";
import { useEffect, useState } from "react";
import type { FC } from "react";
import { useHover } from "react-use";

import classes from "./copy-to-clipboard.module.scss";
import { IconCopy } from "./icons";

type Props = {
  message?: string;
  text: string;
};

const CopyToClipboard: FC<Props> = ({ message, text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (e) {
      console.error(e);
    }
  };

  const [children, hovered] = useHover((hovered) => (
    <button type="button" onClick={handleCopy} className={classes.root}>
      <IconCopy />
      {hovered && (copied ? "Copied to clipboard" : message)}
    </button>
  ));

  useEffect(() => {
    if (!hovered) setCopied(false);
  }, [hovered]);

  return children;
};

export { CopyToClipboard };
