import { DefaultApi, Configuration } from "@generated/api";

const axiosConfig = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_URL,
  baseOptions: {
    Headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
const api = new DefaultApi(axiosConfig);

export { api, axiosConfig };
