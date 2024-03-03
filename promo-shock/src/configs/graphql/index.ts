import { GraphQLClient } from "graphql-request";

const graphql = new GraphQLClient(process.env.NEXT_PUBLIC_SUBGRAPH_URL);

export { graphql };
