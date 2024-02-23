import { z } from "zod";

import { zDayjs, zUploadFile } from "@promo-shock/shared/utils/zod";

const formSchema = z.object({
  stream_name: z.string().min(1),
  stream_symbol: z.string().min(1),
  stream_cap: z.number().min(1),
  stream_sale_time: z.tuple([zDayjs(), zDayjs()]),
  stream_description: z.string().min(1).max(100),
  stream_link: z.string().min(1),
  stream_date: zDayjs(),
  stream_time: z.tuple([zDayjs(), zDayjs()]),
  stream_price: z.number().min(1),
  streamer_link: z.string().min(1),
  stream_banner: zUploadFile(),
  stream_image: zUploadFile(),
});

export { formSchema };
