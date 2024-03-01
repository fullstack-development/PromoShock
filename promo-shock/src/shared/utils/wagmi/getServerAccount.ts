import { headers } from "next/headers";
import type { Config } from "wagmi";
import { cookieToInitialState } from "wagmi";

const getServerAccount = (config: Config) => {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  const address = initialState?.current
    ? initialState?.connections.get(initialState.current)?.accounts[0]
    : undefined;
  return address;
};

export { getServerAccount };
