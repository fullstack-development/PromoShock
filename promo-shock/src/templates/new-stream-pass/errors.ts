import type { ZodErrorMap } from "zod";

const errorMap: ZodErrorMap = () => ({ message: "Please fill the field" });

export { errorMap };
