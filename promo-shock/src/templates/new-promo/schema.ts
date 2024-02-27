import type { Address } from "viem";
import { z } from "zod";

import { readTicketSupportsInterface } from "@generated/wagmi";

import { web3Config } from "@promo-shock/configs/web3";
import { TICKET_INTERFACE_BYTES } from "@promo-shock/shared/constants";
import { zAddress, zDayjs, zUploadFile } from "@promo-shock/shared/utils/zod";

const addressIsTicket = async (address: Address) => {
  try {
    const supportsInterface = await readTicketSupportsInterface(web3Config, {
      address,
      args: [TICKET_INTERFACE_BYTES],
    });

    return supportsInterface;
  } catch {
    return false;
  }
};

const formSchema = z.object({
  promo_cover: zUploadFile(),
  promo_name: z.string(),
  promo_description: z.string(),
  promo_sale_time: z.array(zDayjs()),
  promo_shopping_link: z.string(),
  promo_stream_addresses: z.array(
    z
      .object({ value: zAddress() })
      .refine(({ value }) => addressIsTicket(value as Address), {
        message: "Given address is not a ticket",
        path: ["value"],
      }),
  ),
});

export { formSchema };
