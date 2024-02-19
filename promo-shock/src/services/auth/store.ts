import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createIsomorphicStorage } from "@promo-shock/shared/utils/zustand";

type AuthStore = {
  token: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
};

const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      token: null as string | null,
      signIn: (token: string) => set({ token }),
      signOut: () => set({ token: null }),
    }),
    {
      name: "auth-store",
      storage: createIsomorphicStorage(),
    },
  ),
);

export { useAuthStore };
