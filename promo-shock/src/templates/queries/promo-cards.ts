import type { QueryFunctionContext } from "@tanstack/react-query";
import type { ComponentProps } from "react";

import { api } from "@promo-shock/configs/axios";
import type { PromoCard } from "@promo-shock/ui-kit";

type Filters = {
  owner?: string;
  stream?: string;
  limit?: number;
};

const promoToPromoCard = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  promo: any,
  idx: number,
): ComponentProps<typeof PromoCard> & { id: string } => ({
  id: promo.id || idx.toString(),
  name: promo.name,
  description: promo.description,
  cover: promo.cover,
  startDate: Number(promo.startDate) * 1000,
  endDate: Number(promo.endDate) * 1000,
  saleUrl: "",
});

const fetchPromoCards = async ({
  queryKey: [, filters],
  signal,
}: QueryFunctionContext<["promos", filters?: Filters]>) => {
  const limit = filters?.limit;
  // FIXME :: codegen parameters
  const { data } = await api.allPromosPromoGet(limit, 0, {
    params: {
      limit,
      offset: 0,
    },
    signal,
  });
  return data.map(promoToPromoCard);
};

const fetchInfinitePromoCards = async ({
  queryKey: [, filters],
  pageParam,
  signal,
}: QueryFunctionContext<["promos", filters?: Filters], number>) => {
  const limit = filters?.limit || 1;
  // FIXME :: codegen parameters
  const { data } = await api.allPromosPromoGet(limit * pageParam, limit, {
    params: {
      limit,
      offset: limit * pageParam,
    },
    signal,
  });
  return {
    pages: (data as []).map(promoToPromoCard),
    cursor: data.length ? pageParam + 1 : null,
  };
};

export { fetchPromoCards, fetchInfinitePromoCards };
