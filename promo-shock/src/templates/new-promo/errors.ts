import type { ZodErrorMap } from "zod";

// TODO:: handle each error case
const errorMap: ZodErrorMap = () => ({ message: "Please fill the field" });

export { errorMap };
