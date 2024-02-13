import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthStore = {
  token: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
};

const createIsomorphicStorage = <T>() =>
  createJSONStorage<T>(() => ({
    setItem: (...args) => window.localStorage.setItem(...args),
    removeItem: (...args) => window.localStorage.removeItem(...args),
    getItem: async (...args) =>
      new Promise((resolve) => {
        if (typeof window === "undefined") {
          resolve(null);
        } else {
          setTimeout(() => {
            resolve(window.localStorage.getItem(...args));
          }, 0);
        }
      }),
  }));

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
