import type { QueryFunctionContext } from "@tanstack/react-query";
import type { ComponentProps } from "react";

import { api } from "@promo-shock/configs/axios";
import type { StreamCard } from "@promo-shock/ui-kit";

const streamToStreamCard = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stream: any,
): Omit<ComponentProps<typeof StreamCard>, "onlyWatch" | "highlighted"> => ({
  saleAddress: stream.sale_address,
  ticketAddress: stream.ticket_addr,
  name: stream.name,
  description: stream.description,
  banner: stream.banner,
  price: stream.price,
  date: Number(stream.sale_date) * 1000,
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
}: QueryFunctionContext<[string, filters?: Filters]>) => {
  const limit = filters?.limit;
  const owner = filters?.owner?.toLocaleLowerCase();
  // FIXME :: codegen parameters
  const { data } = await api.allTicketsTicketGet(
    undefined,
    undefined,
    undefined,
    {
      params: {
        limit,
        owner,
        offset: 0,
      },
      signal,
    },
  );

  return (data as []).map(streamToStreamCard);
};

const fetchInfiniteStreamCards = async ({
  queryKey: [, filters],
  pageParam,
  signal,
}: QueryFunctionContext<[string, filters?: Filters], number>) => {
  // FIXME :: codegen parameters
  const limit = filters?.limit;
  const owner = filters?.owner?.toLocaleLowerCase();
  const { data } = await api.allTicketsTicketGet(
    undefined,
    undefined,
    undefined,
    {
      params: {
        limit,
        owner,
        offset: limit && limit * pageParam,
      },
      signal,
    },
  );

  return {
    pages: (data as []).map(streamToStreamCard),
    cursor: data.length ? pageParam + 1 : null,
  };
};

export { fetchStreamCards, fetchInfiniteStreamCards };
