import dayjs from "dayjs";
import { z } from "zod";

// @ts-expect-error Parameter 'dayjs' is constructor function.
const zDayjs = () => z.instanceof(dayjs);
const zUploadFile = () =>
  z.object({
    originFileObj:
      typeof window === "undefined" ? z.custom(() => true) : z.instanceof(File),
  });

export { zDayjs, zUploadFile };
