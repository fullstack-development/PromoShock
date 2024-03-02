import type { QueryFunction } from "@tanstack/react-query";

import { apiClient } from "@promo-shock/configs/api";
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
  ticketAddress: string,
): Promo => ({
  ticketAddress,
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
  if (buyer) {
    const res = await apiClient.my_promos_promo_my_get({
      queries: {
        offset,
        buyer,
        limit,
      },
      signal,
    });
    return res.reduce(
      (promos, inputPromo) => [
        ...promos,
        ...inputPromo.tickets.map((ticket) =>
          promoToPromoCard(inputPromo, ticket.ticket_addr),
        ),
      ],
      [] as Promo[],
    );
  } else {
    const res = await apiClient.all_promos_promo_get({
      queries: {
        stream,
        owner,
        offset,
        limit,
      },
      signal,
    });
    return res.reduce(
      (promos, inputPromo) => [
        ...promos,
        ...inputPromo.tickets.map((ticket) =>
          promoToPromoCard(inputPromo, ticket.ticket_addr),
        ),
      ],
      [] as Promo[],
    );
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
  if (buyer) {
    const res = await apiClient.my_promos_promo_my_get({
      queries: {
        offset,
        buyer,
        limit,
      },
      signal,
    });
    return {
      items: res.reduce(
        (promos, inputPromo) => [
          ...promos,
          ...inputPromo.tickets.map((ticket) =>
            promoToPromoCard(inputPromo, ticket.ticket_addr),
          ),
        ],
        [] as Promo[],
      ),
      cursor: res.length ? pageParam + 1 : null,
    };
  } else {
    const res = await apiClient.all_promos_promo_get({
      queries: {
        stream,
        owner,
        offset,
        limit,
      },
      signal,
    });
    return {
      items: res.reduce(
        (promos, inputPromo) => [
          ...promos,
          ...inputPromo.tickets.map((ticket) =>
            promoToPromoCard(inputPromo, ticket.ticket_addr),
          ),
        ],
        [] as Promo[],
      ),
      cursor: res.length ? pageParam + 1 : null,
    };
  }
};

export { fetchPromoCards, fetchInfinitePromoCards };
