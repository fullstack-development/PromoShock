import type { FC, PropsWithChildren } from "react";

import { WithBreadcrumb } from "@promo-shock/layouts";
import { Address, isAddress } from "viem";
import { notFound } from "next/navigation";
import { queryClient } from "@promo-shock/configs/query";
import { fetchStreamCard } from "@promo-shock/templates";

const StreamLayout: FC<PropsWithChildren<{ params: { address: Address } }>> = async ({ children, params: { address } }) => {
  if (!isAddress(address)) notFound();

  const stream = await queryClient.fetchQuery({
    queryKey: ["streams", address] as ["streams", string],
    queryFn: fetchStreamCard,
  });

  if (!stream) notFound();

  return <WithBreadcrumb replaceAddressBy={stream.name}>{children}</WithBreadcrumb>;
};

export default StreamLayout;
