import { createJSONStorage } from "zustand/middleware";

import { sleep } from "../promise";

const createIsomorphicStorage = <T>() =>
  createJSONStorage<T>(() => ({
    setItem: (...args) => window.localStorage.setItem(...args),
    removeItem: (...args) => window.localStorage.removeItem(...args),
    getItem: async (...args) => {
      if (typeof window === "undefined") {
        return null;
      } else {
        await sleep(0);
        return window.localStorage.getItem(...args);
      }
    },
  }));

export { createIsomorphicStorage };
