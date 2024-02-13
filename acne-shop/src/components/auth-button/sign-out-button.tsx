"use client";
import type { ComponentProps, FC } from "react";

import { useAuthStore } from "@acne-shop/services";
import { Button } from "@acne-shop/ui-kit";

type Props = Pick<ComponentProps<typeof Button>, "size" | "theme">;

const SignOutButton: FC<Props> = (props) => {
  const authStore = useAuthStore();

  return <Button text="Sign out" onClick={authStore.signOut} {...props} />;
};

export { SignOutButton };
