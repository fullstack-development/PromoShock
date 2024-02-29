import type { Address } from "viem";
import { z } from "zod";

import { readTicketSupportsInterface } from "@generated/wagmi";

import { web3Config } from "@promo-shock/configs/web3";
import { TICKET_INTERFACE_BYTES } from "@promo-shock/shared/constants";
import { zAddress, zDayjs, zUploadFile } from "@promo-shock/shared/utils/zod";

const supportsInterface = async (address: Address) => {
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
  promo_cover: zUploadFile({
    errorMap: (issue) =>
      issue.code === z.ZodIssueCode.invalid_type
        ? { message: "Cover is required" }
        : { message: issue.message || "Invalid value" },
  }),
  promo_name: z.string({
    errorMap: (issue) =>
      issue.code === z.ZodIssueCode.invalid_type
        ? { message: "Name is required" }
        : { message: issue.message || "Invalid value" },
  }),
  promo_description: z.string({
    errorMap: (issue) =>
      issue.code === z.ZodIssueCode.invalid_type
        ? { message: "Description is required" }
        : { message: issue.message || "Invalid value" },
  }),
  promo_sale_time: z
    .tuple([zDayjs(), zDayjs()], {
      errorMap: (issue) =>
        issue.code === z.ZodIssueCode.invalid_type
          ? { message: "Sale time is required" }
          : { message: issue.message || "Invalid value" },
    })
    .refine(([start, end]) => end.diff(start, "day") !== 0, {
      message: "Sale time must be at least 1 day",
    }),
  promo_shopping_link: z.string({
    errorMap: (issue) =>
      issue.code === z.ZodIssueCode.invalid_type
        ? { message: "Shopping link is required" }
        : { message: issue.message || "Invalid value" },
  }),
  promo_stream_addresses: z.array(
    z
      .object({
        value: zAddress(
          {
            errorMap: (issue) =>
              issue.code === z.ZodIssueCode.invalid_type
                ? { message: "Address is required" }
                : { message: issue.message || "Invalid value" },
          },
          ["value"],
        ),
      })
      .refine(({ value }) => supportsInterface(value as Address), {
        message: "Given address is not a ticket",
        path: ["value"],
      }),
  ),
});

export { formSchema };
