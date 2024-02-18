import type { QueryFunctionContext } from "@tanstack/react-query";
import type { ComponentProps } from "react";

import { api } from "@promo-shock/configs/axios";
import type { StreamCard } from "@promo-shock/ui-kit";

const streamToStreamCard = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stream: any,
): Omit<ComponentProps<typeof StreamCard>, "onlyWatch"> => ({
  address: stream.sale_address,
  name: stream.name,
  description: stream.description,
  banner: stream.banner,
  price: stream.price,
  date: Number(stream.start_date) * 1000,
  totalAmount: stream.total_amount,
  reservedAmount: stream.reserved_amount,
});

type Filters = {
  owner?: string;
  limit?: number;
};

const fetchStreamCards = async ({
  queryKey: [, filters],
  signal,
}: QueryFunctionContext<["streams", filters?: Filters]>) => {
  const limit = filters?.limit;
  // FIXME :: codegen parameters
  const { data } = await api.allTicketsTicketGet(limit, 0, {
    params: {
      limit,
      offset: 0,
    },
    signal,
  });

  return data.map(streamToStreamCard);
};

const fetchInfiniteStreamCards = async ({
  queryKey: [, filters],
  pageParam,
  signal,
}: QueryFunctionContext<["streams", filters?: Filters], number>) => {
  // FIXME :: codegen parameters
  const limit = filters?.limit || 1;
  const { data } = await api.allTicketsTicketGet(limit * pageParam, limit, {
    params: {
      limit,
      offset: limit * pageParam,
    },
    signal,
  });

  return {
    pages: data.map(streamToStreamCard),
    cursor: data.length ? pageParam + 1 : null,
  };
};

export { fetchStreamCards, fetchInfiniteStreamCards };
