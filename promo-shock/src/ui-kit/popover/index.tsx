"use client";
import { Popover as AntdPopover } from "antd";
import classNames from "classnames";
import { useState, useImperativeHandle, forwardRef } from "react";
import type { PropsWithChildren, ReactNode } from "react";

import type { PropsWithClassName } from "@promo-shock/shared/types";

import classes from "./popover.module.scss";
import type { TooltipPlacement } from "../types";

type PopoverRefProps = { close: () => void; open: () => void };

type Props = {
  content: ReactNode;
  placement?: TooltipPlacement;
};

const Popover = forwardRef<
  PopoverRefProps | undefined,
  PropsWithClassName<PropsWithChildren<Props>>
>(({ content, children, className, placement }, ref) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    close: () => setOpen(false),
    open: () => setOpen(true),
  }));

  return (
    <AntdPopover
      open={open}
      rootClassName={classNames(className, classes.root)}
      content={content}
      trigger="click"
      placement={placement}
      onOpenChange={setOpen}
    >
      {children}
    </AntdPopover>
  );
});

export type { PopoverRefProps };
export { Popover };
