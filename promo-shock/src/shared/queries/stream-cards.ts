import type { QueryFunction } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { gql } from "graphql-request";

import { apiClient } from "@promo-shock/configs/api";
import { graphql } from "@promo-shock/configs/graphql";
import type { Stream } from "@promo-shock/shared/entities";

const apiTicketToStreamCard = (
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
  endDate:
    (Number(stream.end_date) || Number(stream.start_date) + 60 * 60 * 24) *
    1000,
  streamLink: stream.stream_link,
  streamerLink: stream.streamer_link,
  saleStartDate: Number(stream.sale_start_date) * 1000,
  saleEndDate: Number(stream.sale_end_date) * 1000,
  totalAmount: stream.total_amount,
  reservedAmount: stream.reserved_amount,
  purchased: stream.purchased,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const subgraphStreamToStreamCard = (stream: any): Stream => ({
  saleAddress: stream.saleAddress,
  ticketAddress: stream.ticketAddress,
  paymentTokenAddress: stream.paymentTokenAddress,
  name: stream.metadata.name,
  description: stream.metadata.description,
  banner: stream.metadata.banner,
  price: stream.price,
  startDate: Number(stream.metadata.start_time) * 1000,
  endDate:
    (Number(stream.metadata.end_time) ||
      Number(stream.metadata.start_time) + 60 * 60 * 24) * 1000,
  streamLink: stream.metadata.stream_link,
  streamerLink: stream.metadata.streamer_link,
  saleStartDate: Number(stream.saleStartDate) * 1000,
  saleEndDate: Number(stream.saleEndDate) * 1000,
  totalAmount: Number(stream.totalAmount),
  reservedAmount: Number(stream.reservedAmount),
  purchased: stream.purchased,
});

type Filters = {
  buyer?: string;
  owner?: string;
  limit?: number;
};

const fetchStreamCard: QueryFunction<Stream | null, [string, string]> = async ({
  queryKey: [, address],
  signal,
}) => {
  // FIXME :: codegen parameters
  try {
    graphql.requestConfig.signal = signal;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await graphql.request({
      document: gql`
        query StreamQuery($id: Bytes!) {
          stream(id: $id) {
            metadata {
              banner
              description
              name
              start_time
              stream_link
              streamer_link
            }
            owner
            paymentTokenAddress
            purchased
            price
            reservedAmount
            saleAddress
            saleEndDate
            saleStartDate
            ticketAddress
            totalAmount
          }
        }
      `,
      signal,
      variables: { id: address },
    });

    return subgraphStreamToStreamCard(res.stream);
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
};

const fetchStreamCards: QueryFunction<Stream[], [string, Filters]> = async ({
  queryKey: [, filters],
  signal,
}) => {
  const offset = 0;
  const limit = filters?.limit;
  const owner = filters?.owner?.toLowerCase();
  const buyer = filters?.buyer?.toLowerCase();
  const res = await apiClient.all_tickets_ticket_get({
    queries: {
      owner,
      buyer,
      offset,
      limit,
    },
    signal,
  });

  return res.map(apiTicketToStreamCard);
};

const fetchInfiniteStreamCards: QueryFunction<
  { items: Stream[]; cursor: number | null },
  [string, Filters],
  number
> = async ({ queryKey: [, filters], pageParam, signal }) => {
  const limit = filters?.limit;
  const offset = limit && limit * pageParam;
  const owner = filters?.owner?.toLowerCase();
  const buyer = filters?.buyer?.toLowerCase();
  const res = await apiClient.all_tickets_ticket_get({
    queries: {
      owner,
      buyer,
      offset,
      limit,
    },
    signal,
  });

  return {
    items: res.map(apiTicketToStreamCard),
    cursor: res.length ? pageParam + 1 : null,
  };
};

export { fetchStreamCard, fetchStreamCards, fetchInfiniteStreamCards };
