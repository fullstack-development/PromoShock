import type { QueryFunctionContext } from "@tanstack/react-query";

import { api } from "@promo-shock/configs/axios";
import type { Stream } from "@promo-shock/shared/entities";

const streamToStream = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stream: any,
): Stream => ({
  saleAddress: stream.sale_address,
  ticketAddress: stream.ticket_address,
  paymentTokenAddress: stream.payment_token_address,
  name: stream.name,
  description: stream.description,
  banner: stream.banner,
  price: stream.price,
  startDate: Number(stream.start_date) * 1000,
  endDate: (Number(stream.start_date) + 60 * 60 * 24) * 1000,
  streamLink: stream.stream_link,
  streamerLink: stream.streamer_link,
  saleStartDate: Number(stream.sale_start_date) * 1000,
  saleEndDate: Number(stream.sale_end_date) * 1000,
  totalAmount: stream.total_amount,
  reservedAmount: stream.reserved_amount,
  purchased: stream.purchased,
});

type Filters = {
  account?: string;
  owner?: string;
  limit?: number;
};

const fetchStreamCard = async ({
  queryKey: [, address],
  signal,
}: QueryFunctionContext<[string, address: string]>) => {
  // FIXME :: codegen parameters
  const { data } = await api.getStreamTicketTicketAddrGet(address, {
    params: {
      address,
    },
    signal,
  });
  return streamToStream(data);
};

const fetchStreamCards = async ({
  queryKey: [, filters],
  signal,
}: QueryFunctionContext<[string, filters?: Filters]>) => {
  const limit = filters?.limit;
  const owner = filters?.owner?.toLowerCase();
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

  return (data as []).map(streamToStream);
};

const fetchInfiniteStreamCards = async ({
  queryKey: [, filters],
  pageParam,
  signal,
}: QueryFunctionContext<[string, filters?: Filters], number>) => {
  // FIXME :: codegen parameters
  const limit = filters?.limit;
  const owner = filters?.owner?.toLowerCase();
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
    pages: (data as []).map(streamToStream),
    cursor: data.length ? pageParam + 1 : null,
  };
};

export { fetchStreamCard, fetchStreamCards, fetchInfiniteStreamCards };
