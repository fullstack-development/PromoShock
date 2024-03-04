import { web3StateContext } from "./web3StateContext";

const getServerAccount = () => {
  const initialState = web3StateContext.get();
  const address = initialState?.current
    ? initialState?.connections.get(initialState.current)?.accounts[0]
    : undefined;
  return address;
};

export { getServerAccount };
