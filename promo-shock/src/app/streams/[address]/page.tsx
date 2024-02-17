import type { FC } from "react";
import type { Address } from "viem";

import { Stream } from "@promo-shock/templates";

import { STREAM_INFO_MOCK } from "./mocks/fixtures";

const getData = (_: string) => {
  return STREAM_INFO_MOCK;
};

const StreamPage: FC<{ params: { address: Address } }> = async ({ params }) => {
  const data = await getData(params.address);
  return <Stream {...data} />;
};

export default StreamPage;
