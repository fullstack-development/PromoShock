"use client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import type { ComponentProps, FC } from "react";
import { useAccount, useAccountEffect, useDisconnect } from "wagmi";

import { useAuthStore } from "@promo-shock/services";
import { trim } from "@promo-shock/shared/utils";
import type { PopoverRefProps } from "@promo-shock/ui-kit";
import { Button, Popover, TabLink } from "@promo-shock/ui-kit";

import classes from "./wallet-button.module.scss";

type Props = Pick<ComponentProps<typeof Button>, "size" | "theme">;

const WalletButton: FC<Props> = (props) => {
  const authStore = useAuthStore();
  const { address } = useAccount();
  const disconnect = useDisconnect();
  const { openConnectModal = () => void 0 } = useConnectModal();
  const pathname = usePathname();
  const popoverRef = useRef<PopoverRefProps>();

  useAccountEffect({
    onDisconnect: authStore.signOut,
  });

  const handleLogout = () => {
    popoverRef.current?.close();
    disconnect.disconnect();
  };

  const handleClickPopoverLink = () => {
    popoverRef.current?.close();
  };

  return address ? (
    <Popover
      ref={popoverRef}
      placement="bottomRight"
      content={
        <div className={classes.popover_content}>
          <TabLink
            href="/profile/my-streams"
            text="My streams"
            active={pathname.includes("/profile/my-streams")}
            onClick={handleClickPopoverLink}
            className={classNames({
              [classes.invert]: !pathname.includes("/profile/my-streams"),
            })}
          />
          <TabLink
            href="/profile/my-promos"
            text="My promos"
            active={pathname.includes("/profile/my-promos")}
            onClick={handleClickPopoverLink}
            className={classNames({
              [classes.invert]: !pathname.includes("/profile/my-promos"),
            })}
          />
          <div className={classes.popover_separator} />
          <Button
            text="Log out"
            theme="quinary"
            size="small"
            onClick={handleLogout}
          />
        </div>
      }
      className={classes.popover}
    >
      <Button
        text={trim(address, 5, 5)}
        theme="primary"
        size="medium"
        {...props}
      />
    </Popover>
  ) : (
    <Button
      text="Connect wallet"
      onClick={openConnectModal}
      theme="primary"
      size="medium"
      {...props}
    />
  );
};

export { WalletButton };
