import { createServerContext } from "@sodefa/next-server-context";
import type { State } from "wagmi";

const web3StateContext = createServerContext<State | undefined>();

export { web3StateContext };
