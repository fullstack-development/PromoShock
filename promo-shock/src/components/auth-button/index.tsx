"use client";
import type { ComponentProps, FC } from "react";

import { useAuthStore } from "@promo-shock/services";
import type { Button } from "@promo-shock/ui-kit";

import { SignInButton } from "./sign-in-button";
import { SignOutButton } from "./sign-out-button";

type Props = Pick<ComponentProps<typeof Button>, "size" | "theme">;

const AuthButton: FC<Props> = (props) => {
  const authStore = useAuthStore();

  return authStore.token ? (
    <SignOutButton theme="primary" size="medium" {...props} />
  ) : (
    <SignInButton theme="primary" size="medium" {...props} />
  );
};

export { AuthButton };
