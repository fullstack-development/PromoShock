"use client";
import { forwardRef, useState } from "react";
import type { ComponentProps, MouseEventHandler } from "react";
import { useAccount, useConnections, useSwitchChain } from "wagmi";

import type { Button } from "@promo-shock/ui-kit";

type Props<T extends ComponentProps<typeof Button>> = T;

const withSwitchNetwork = <T extends ComponentProps<typeof Button>>(
  Component: React.ComponentType<T>,
) => {
  return forwardRef<HTMLButtonElement, Props<T>>(
    function WithSwitchNetwork(props, ref) {
      const account = useAccount();
      const [connection] = useConnections() || [];
      const chainId = connection?.chainId;
      const switchChain = useSwitchChain();
      const [pending, setPending] = useState(false);

      const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
        if (wrongChain) {
          e.preventDefault();
          try {
            setPending(true);
            await switchChain.switchChainAsync({
              chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
            });
          } catch (e) {
            // TODO :: handle error
            console.error(e);
          } finally {
            setPending(false);
          }
        } else {
          await props.onClick?.(e);
        }
      };

      const disabled = !account.address || props.disabled;
      const loading =
        ((!!account.address && typeof chainId === "undefined") ||
          props.loading ||
          pending) &&
        !disabled;
      const wrongChain =
        typeof chainId !== "undefined" &&
        chainId !== Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID) &&
        !disabled &&
        !loading;

      return (
        <Component
          ref={ref}
          {...props}
          text={
            loading
              ? "Blockchain magic happening"
              : wrongChain
              ? "Switch network to proceed"
              : props.text
          }
          loading={loading || pending}
          type={wrongChain ? "button" : props.type}
          disabled={disabled}
          onClick={handleClick}
        />
      );
    },
  );
};

export { withSwitchNetwork };
