"use client";
import type { ComponentProps, FC } from "react";

import { useAuthStore } from "@promo-shock/services";
import { Button } from "@promo-shock/ui-kit";

type Props = Pick<ComponentProps<typeof Button>, "size">;

const SignOutButton: FC<Props> = (props) => {
  const authStore = useAuthStore();

  return <Button text="Sign out" onClick={authStore.signOut} {...props} />;
};

export { SignOutButton };
