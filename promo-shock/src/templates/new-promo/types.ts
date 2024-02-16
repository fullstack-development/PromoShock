import type { UploadFile } from "antd";
import type { Dayjs } from "dayjs";
import type { Address } from "viem";

type FormData = {
  promo_cover: UploadFile;
  promo_name: string;
  promo_description: string;
  promo_sale_time: [Dayjs, Dayjs];
  promo_stream_addresses: Array<Address>;
};

export type { FormData };
