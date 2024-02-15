import type { UploadFile } from "antd";
import type { Dayjs } from "dayjs";
import type { Address } from "viem";

type CreateTicketData = {
  startTime: bigint;
  endTime: bigint;
  price: bigint;
  paymentToken: Address;
  name: string;
  symbol: string;
  baseUri: string;
  cap: number;
};

type Metadata = {
  name: string;
  description: string;
  image: string;
  banner: string;
  start_time: number;
  stream_link: string;
  streamer_link: string;
};

type FormData = {
  stream_name: string;
  stream_symbol: string;
  stream_cap: number;
  stream_sale_time: [start: Dayjs, end: Dayjs];
  stream_description: string;
  stream_link: string;
  stream_date: Dayjs;
  stream_time: Dayjs;
  stream_price: number;
  streamer_link: string;
  stream_banner: UploadFile;
  stream_image: UploadFile;
};

export type { FormData, CreateTicketData, Metadata };
