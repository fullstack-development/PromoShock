import dayjs from "dayjs";
import { z } from "zod";

import { zDayjs, zUploadFile } from "@promo-shock/shared/utils/zod";

const formSchema = z.object({
  stream_name: z.string({
    errorMap: (issue) =>
      issue.code === z.ZodIssueCode.invalid_type
        ? { message: "Name is required" }
        : { message: issue.message || "Invalid input" },
  }),
  stream_symbol: z.string({
    errorMap: (issue) =>
      issue.code === z.ZodIssueCode.invalid_type
        ? { message: "Symbol is required" }
        : { message: issue.message || "Invalid input" },
  }),
  stream_cap: z.number({
    errorMap: (issue) =>
      issue.code === z.ZodIssueCode.invalid_type
        ? { message: "Cap is required" }
        : { message: issue.message || "Invalid input" },
  }),
  stream_sale_time: z
    .tuple([zDayjs(), zDayjs()], {
      errorMap: (issue) =>
        issue.code === z.ZodIssueCode.invalid_type
          ? { message: "Sale time is required" }
          : { message: issue.message || "Invalid input" },
    })
    .refine(([start, end]) => end.diff(start, "day") !== 0, {
      message: "Sale time must be at least 1 day",
    })
    .refine(([start, end]) => end.diff(start, "day") <= 30, {
      message: "Sale time must be at most 30 days",
    })
    .refine(([start]) => start.isAfter(dayjs().subtract(1, "day")), {
      message: "Sale cannot be in the past",
    }),
  stream_description: z
    .string({
      errorMap: (issue) =>
        issue.code === z.ZodIssueCode.invalid_type
          ? { message: "Description is required" }
          : { message: issue.message || "Invalid input" },
    })
    .max(100, { message: "Description is too long" }),
  stream_link: z.string({
    errorMap: (issue) =>
      issue.code === z.ZodIssueCode.invalid_type
        ? { message: "Link is required" }
        : { message: issue.message || "Invalid input" },
  }),
  stream_date: zDayjs({
    message: "Date is required",
  }).refine((date) => date.isAfter(dayjs().subtract(1, "day")), {
    message: "Stream cannot be in the past",
  }),
  stream_time: z.tuple([zDayjs(), zDayjs()], {
    errorMap: (issue) =>
      issue.code === z.ZodIssueCode.invalid_type
        ? { message: "Time is required" }
        : { message: issue.message || "Invalid input" },
  }),
  stream_price: z.number({
    errorMap: (issue) =>
      issue.code === z.ZodIssueCode.invalid_type
        ? { message: "Price is required" }
        : { message: issue.message || "Invalid input" },
  }),
  streamer_link: z.string({
    errorMap: (issue) =>
      issue.code === z.ZodIssueCode.invalid_type
        ? { message: "Link is required" }
        : { message: issue.message || "Invalid input" },
  }),
  stream_banner: zUploadFile({
    errorMap: (issue) =>
      issue.code === z.ZodIssueCode.invalid_type
        ? { message: "Banner is required" }
        : { message: issue.message || "Invalid input" },
  }).refine((file) => file.originFileObj.size < 2 * 1024 * 1024, {
    message: "Banner size must be less than 1MB",
  }),
  stream_image: zUploadFile({
    errorMap: (issue) =>
      issue.code === z.ZodIssueCode.invalid_type
        ? { message: "Image is required" }
        : { message: issue.message || "Invalid input" },
  }).refine((file) => file.originFileObj.size < 2 * 1024 * 1024, {
    message: "Image size must be less than 1MB",
  }),
});

export { formSchema };
