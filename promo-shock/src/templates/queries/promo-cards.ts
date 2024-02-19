import type { QueryFunctionContext } from "@tanstack/react-query";

import { api } from "@promo-shock/configs/axios";
import type { Promo } from "@promo-shock/shared/entities";

type Filters = {
  account?: string;
  owner?: string;
  stream?: string;
  limit?: number;
};

const promoToPromoCard = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  promo: any,
): Promo => ({
  promoAddress: promo.promo_addr,
  tokenId: promo.token_id,
  name: promo.name,
  description: promo.description,
  cover: promo.cover,
  startDate: Number(promo.start_date) * 1000,
  endDate: Number(promo.end_date) * 1000,
  shoppingLink: promo.shopping_link,
});

const fetchPromoCards = async ({
  queryKey: [, filters],
  signal,
}: QueryFunctionContext<[string, filters?: Filters]>) => {
  const limit = filters?.limit;
  const owner = filters?.owner?.toLowerCase();
  const stream = filters?.stream?.toLowerCase();
  // FIXME :: codegen parameters
  const { data } = await api.allPromosPromoGet(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      params: {
        limit,
        offset: 0,
        owner,
        stream,
      },
      signal,
    },
  );
  return (data as []).map(promoToPromoCard);
};

const fetchInfinitePromoCards = async ({
  queryKey: [, filters],
  pageParam,
  signal,
}: QueryFunctionContext<[string, filters?: Filters], number>) => {
  const limit = filters?.limit;
  const owner = filters?.owner?.toLowerCase();
  const stream = filters?.stream?.toLowerCase();
  // FIXME :: codegen parameters
  const { data } = await api.allPromosPromoGet(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      params: {
        limit,
        offset: limit && limit * pageParam,
        owner,
        stream,
      },
      signal,
    },
  );
  return {
    pages: (data as []).map(promoToPromoCard),
    cursor: data.length ? pageParam + 1 : null,
  };
};

export { fetchPromoCards, fetchInfinitePromoCards };
