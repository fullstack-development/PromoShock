"use client";
import type { ComponentProps, FC } from "react";

import { useAuthStore } from "@promo-shock/services";
import { useIsMounted } from "@promo-shock/shared/hooks";
import type { Button } from "@promo-shock/ui-kit";

import { SignInButton } from "./sign-in-button";
import { SignOutButton } from "./sign-out-button";

type Props = Pick<ComponentProps<typeof Button>, "size" | "theme">;

const Component: FC<Props> = (props) => {
  const authStore = useAuthStore();

  return authStore.token ? (
    <SignOutButton {...props} />
  ) : (
    <SignInButton {...props} />
  );
};

const AuthButton: FC<Props> = (props) => {
  const isMounted = useIsMounted();

  return isMounted && <Component theme="primary" size="medium" {...props} />;
};

export { AuthButton };
