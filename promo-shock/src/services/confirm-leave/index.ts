import { useEffect } from "react";
import { create } from "zustand";

type ConfirmLeaveStore = {
  enabled: boolean;
  message?: string;
  enable: (message: string) => void;
  disable: () => void;
};

const useConfirmLeaveStore = create<ConfirmLeaveStore>((set) => ({
  enabled: false,
  enable: (message: string) => set({ enabled: true, message }),
  disable: () => set({ enabled: false, message: undefined }),
}));

const useConfirmLeave = (enabled: boolean, message: string) => {
  const store = useConfirmLeaveStore();

  useEffect(() => {
    if (enabled) {
      store.enable(message);
    } else {
      store.disable();
    }

    return () => {
      store.disable();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, message]);
};

const useConfirmLeaveMessage = () => {
  const store = useConfirmLeaveStore();

  return [store.enabled, store.message] as const;
};

export { useConfirmLeave, useConfirmLeaveMessage };
