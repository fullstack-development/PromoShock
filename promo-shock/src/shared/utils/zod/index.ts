import dayjs from "dayjs";
import { isAddress } from "viem";
import { z } from "zod";

// @ts-expect-error Parameter 'dayjs' is constructor function.
const zDayjs = () => z.instanceof(dayjs, { errorMap: () => ({ message: "Please fill the field" }) });
const zUploadFile = () =>
  z.object({
    originFileObj:
      typeof window === "undefined" ? z.custom(() => true) : z.instanceof(File),
  });
const zAddress = () =>
  z.custom((value) => typeof value === "string" && isAddress(value));

export { zDayjs, zUploadFile, zAddress };
