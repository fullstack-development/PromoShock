import { create } from "zustand";

type IsMountedStore = {
  isMounted: boolean;
  mount: () => void;
};

const useIsMountedStore = create<IsMountedStore>((set) => ({
  isMounted: false,
  mount: () => set({ isMounted: true }),
}));

export { useIsMountedStore };
