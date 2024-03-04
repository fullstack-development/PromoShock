import { pageContext } from "@sodefa/next-server-context";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";

import { web3Config } from "@promo-shock/configs/web3";
import { web3StateContext } from "@promo-shock/shared/utils/wagmi";
import { Streams } from "@promo-shock/templates";

const StreamsPage = () => {
  const cookies = headers().get("cookie");
  const web3InitialState = cookieToInitialState(web3Config, cookies);
  web3StateContext.set(web3InitialState);

  return <Streams />;
};

export default pageContext.Wrapper(StreamsPage);
