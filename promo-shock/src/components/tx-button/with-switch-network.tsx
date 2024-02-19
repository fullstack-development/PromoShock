import { forwardRef } from "react";
import type { ComponentProps, MouseEventHandler } from "react";
import { useChainId, useSwitchChain } from "wagmi";

import type { Button } from "@promo-shock/ui-kit";

type Props<T extends ComponentProps<typeof Button>> = T;

const withSwitchNetwork = <T extends ComponentProps<typeof Button>>(
  Component: React.ComponentType<T>,
) => {
  return forwardRef<HTMLButtonElement, Props<T>>(
    function WithSwitchNetwork(props, ref) {
      const chainId = useChainId();
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

      // TODO :: detect current chain
      const wrongChain =
        chainId !== Number(process.env.NEXT_PUBLIC_BSC_CHAIN_ID);
      const loading = props.loading;
      const pending = switchChain.isPending;

      return (
        <Component
          ref={ref}
          {...props}
          text={
            loading || pending
              ? "Blockchain magic happening"
              : wrongChain
              ? "Switch to BSC"
              : props.text
          }
          loading={loading || pending}
          type={wrongChain ? "button" : props.type}
          onClick={handleClick}
        />
      );
    },
  );
};

export { withSwitchNetwork };
