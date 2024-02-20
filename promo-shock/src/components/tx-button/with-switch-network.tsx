import { forwardRef } from "react";
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

      const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
        if (wrongChain) {
          e.preventDefault();
          try {
            await switchChain.switchChainAsync({
              chainId: Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID),
            });
          } catch (e) {
            // TODO :: handle error
            console.error(e);
          }
        } else {
          await props.onClick?.(e);
        }
      };

      const wrongChain =
        chainId !== Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID);
      const loading = props.loading;
      const pending = switchChain.isPending;
      const disabled = !account.address || props.disabled;

      return (
        <Component
          ref={ref}
          {...props}
          text={
            (loading || pending) && !disabled
              ? "Blockchain magic happening"
              : wrongChain && !disabled
              ? "Switch network"
              : props.text
          }
          loading={(loading || pending) && !disabled}
          type={wrongChain ? "button" : props.type}
          disabled={disabled}
          onClick={handleClick}
        />
      );
    },
  );
};

export { withSwitchNetwork };
