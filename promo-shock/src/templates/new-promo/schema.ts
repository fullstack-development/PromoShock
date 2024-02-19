import { z } from "zod";

import { zAddress, zDayjs, zUploadFile } from "@promo-shock/shared/utils/zod";

const formSchema = z.object({
  promo_cover: zUploadFile(),
  promo_name: z.string(),
  promo_description: z.string(),
  promo_sale_time: z.array(zDayjs()),
  promo_shopping_link: z.string(),
  promo_stream_addresses: z.array(z.object({ value: zAddress() })).min(1),
});

export { formSchema };
