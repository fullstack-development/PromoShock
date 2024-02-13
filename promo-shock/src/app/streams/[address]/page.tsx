import type { FC } from "react";
import type { Address } from "viem";

const StreamPage: FC<{ params: { address: Address } }> = ({ params }) => {
  return <>{params.address}</>;
};

export default StreamPage;
