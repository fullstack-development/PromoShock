import type { UploadFile } from "antd";
import type { Dayjs } from "dayjs";
import type { Address } from "viem";

type Metadata = {
  name: string;
  description: string;
  image: File;
};

type CreatePromoData = {
  startTime: bigint;
  endTime: bigint;
  addresses: Array<Address>;
};

type FormData = {
  promo_cover: UploadFile;
  promo_name: string;
  promo_description: string;
  promo_sale_time: [Dayjs, Dayjs];
  promo_stream_addresses: Array<{ value: Address }>;
};

export type { FormData, Metadata, CreatePromoData };
