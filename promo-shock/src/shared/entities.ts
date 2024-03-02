import type { Address } from "viem";

type Stream = {
  name: string;
  description: string;
  saleAddress: Address;
  ticketAddress: Address;
  paymentTokenAddress: Address;
  banner: string;
  price: number;
  startDate: number;
  endDate: number;
  saleStartDate: number;
  saleEndDate: number;
  totalAmount: number;
  reservedAmount: number;
  streamLink: string;
  streamerLink: string;
  purchased: boolean;
};

type Promo = {
  tokenId: string;
  ticketAddress: string;
  promoAddress: string;
  name: string;
  description: string;
  cover: string;
  startDate: number;
  endDate: number;
  shoppingLink: string;
};

export type { Stream, Promo };
