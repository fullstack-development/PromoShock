import type { QueryFunction } from "@tanstack/react-query";

import { api } from "@promo-shock/configs/axios";
import type { Promo } from "@promo-shock/shared/entities";

type Filters = {
  buyer?: string;
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

const fetchPromoCards: QueryFunction<Promo[], [string, Filters]> = async ({
  queryKey: [, filters],
  signal,
}) => {
  const limit = filters?.limit;
  const offset = 0;
  const owner = filters?.owner?.toLowerCase();
  const stream = filters?.stream?.toLowerCase();
  const buyer = filters?.buyer?.toLowerCase();
  // TODO :: uncomment when FastAPI will be correctly generated
  // const { data } = await api.allPromosPromoGet(stream, owner, offset, limit, {
  //   signal,
  // });
  if (buyer) {
    const { data } = await api.myPromosPromoMyGet("", undefined, undefined, {
      params: { buyer, offset, limit },
      signal,
    });
    // FIXME :: codegen return type
    return (data as []).map(promoToPromoCard);
  } else {
    const { data } = await api.allPromosPromoGet(
      undefined,
      undefined,
      undefined,
      undefined,
      {
        params: { stream, owner, offset, limit },
        signal,
      },
    );
    // FIXME :: codegen return type
    return (data as []).map(promoToPromoCard);
  }
};

const fetchInfinitePromoCards: QueryFunction<
  { items: Promo[]; cursor: number | null },
  [string, Filters],
  number
> = async ({ queryKey: [, filters], pageParam, signal }) => {
  const limit = filters?.limit;
  const offset = limit && limit * pageParam;
  const owner = filters?.owner?.toLowerCase();
  const stream = filters?.stream?.toLowerCase();
  const buyer = filters?.buyer?.toLowerCase();
  // TODO :: uncomment when FastAPI will be correctly generated
  // const { data } = await api.allPromosPromoGet(stream, owner, offset, limit, {
  //   signal,
  // });
  if (buyer) {
    const { data } = await api.myPromosPromoMyGet("", undefined, undefined, {
      params: { buyer, offset, limit },
      signal,
    });

    return {
      // FIXME :: codegen return type
      items: (data as []).map(promoToPromoCard),
      cursor: data.length ? pageParam + 1 : null,
    };
  } else {
    const { data } = await api.allPromosPromoGet(
      undefined,
      undefined,
      undefined,
      undefined,
      {
        params: { stream, owner, offset, limit },
        signal,
      },
    );
    return {
      // FIXME :: codegen return type
      items: (data as []).map(promoToPromoCard),
      cursor: data.length ? pageParam + 1 : null,
    };
  }
};

export { fetchPromoCards, fetchInfinitePromoCards };
