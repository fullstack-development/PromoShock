import type { ZodErrorMap } from "zod";

// TODO:: handle each error case
const errorMap: ZodErrorMap = () => {
  return ({ message: "Please fill the field" })
};

export { errorMap };
