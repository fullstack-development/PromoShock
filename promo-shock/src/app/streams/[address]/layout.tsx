import { notFound } from "next/navigation";
import type { FC, PropsWithChildren } from "react";
import type { Address } from "viem";
import { isAddress } from "viem";

import { queryClient } from "@promo-shock/configs/query";
import { WithBreadcrumb } from "@promo-shock/layouts";
import { fetchStreamCard } from "@promo-shock/shared/queries";

const StreamLayout: FC<
  PropsWithChildren<{ params: { address: Address } }>
> = async ({ children, params: { address } }) => {
  if (!isAddress(address)) notFound();

  const stream = await queryClient.fetchQuery({
    queryKey: ["streams", address] as ["streams", string],
    queryFn: fetchStreamCard,
  });

  if (!stream) notFound();

  return <WithBreadcrumb tailTitle={stream.name}>{children}</WithBreadcrumb>;
};

export default StreamLayout;
