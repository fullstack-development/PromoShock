import { createApiClient } from "@generated/zodios";

const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL);

export { apiClient };
