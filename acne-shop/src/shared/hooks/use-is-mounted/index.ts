import { useEffect } from "react";

import { useIsMountedStore } from "./store";

const useInitIsMounted = () => {
  const isMountedStore = useIsMountedStore();

  useEffect(() => {
    if (!isMountedStore.isMounted) isMountedStore.mount();
  }, [isMountedStore]);
};

const useIsMounted = () => {
  const isMountedStore = useIsMountedStore();

  return isMountedStore.isMounted;
};

export { useInitIsMounted, useIsMounted };
