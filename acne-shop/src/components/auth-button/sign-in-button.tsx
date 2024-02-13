"use client";
import { useMutation } from "@tanstack/react-query";
import type { ComponentProps, FC } from "react";
import { useAccount } from "wagmi";

import { useAuthStore } from "@acne-shop/services";
import { Button } from "@acne-shop/ui-kit";

type Props = Pick<ComponentProps<typeof Button>, "size" | "theme">;

const SignInButton: FC<Props> = (props) => {
  const { address } = useAccount();
  const authStore = useAuthStore();

  const signInMutation = useMutation({
    mutationFn: async () => {
      if (address) {
        authStore.signIn(address);
      }
    },
  });

  return (
    <Button
      text="Sign in"
      disabled={!address}
      onClick={signInMutation.mutate}
      {...props}
    />
  );
};

export { SignInButton };
