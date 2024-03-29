"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import type { ComponentProps, FC, MouseEventHandler } from "react";
import { forwardRef } from "react";
import { useAccount } from "wagmi";

import type { Button } from "@promo-shock/ui-kit";

type Props<T extends ComponentProps<typeof Button>> = T;

const withConnect = <T extends ComponentProps<typeof Button>>(
  Component: FC<Props<T>>,
) => {
  return forwardRef<HTMLButtonElement, Props<T>>(
    function WithConnect(props, ref) {
      const account = useAccount();
      const connected = !!account.address;
      const { open } = useWeb3Modal();

      const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        if (!connected) {
          open();
        } else {
          props.onClick?.(e);
        }
      };

      return (
        <Component
          {...props}
          text={connected ? props.text : "Connect to proceed"}
          type={connected ? props.type : "button"}
          onClick={handleClick}
          disabled={connected && props.disabled}
          ref={ref}
        />
      );
    },
  );
};

export { withConnect };
