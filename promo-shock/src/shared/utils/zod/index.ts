import dayjs from "dayjs";
import type { Address } from "viem";
import { isAddress } from "viem";
import { z } from "zod";

const zDayjs = () =>
  // @ts-expect-error Parameter 'dayjs' is constructor function.
  z.instanceof(dayjs, {
    errorMap: () => ({ message: "Please fill the field" }),
  });
const zUploadFile = () =>
  z.object({
    originFileObj:
      typeof window === "undefined" ? z.custom(() => true) : z.instanceof(File),
  });
const zAddress = () =>
  z.custom(
    (value): value is Address => typeof value === "string" && isAddress(value),
  );

export { zDayjs, zUploadFile, zAddress };
