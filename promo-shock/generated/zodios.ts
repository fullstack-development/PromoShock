import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const to_block = z.union([z.number(), z.null()]).optional();
const ValidationError = z
  .object({
    loc: z.array(z.union([z.string(), z.number()])),
    msg: z.string(),
    type: z.string(),
  })
  .passthrough();
const HTTPValidationError = z
  .object({ detail: z.array(ValidationError) })
  .partial()
  .passthrough();
const owner = z.union([z.string(), z.null()]).optional();
const Stream = z
  .object({
    owner_address: z.string(),
    sale_address: z.string(),
    ticket_address: z.string(),
    created: z.number().int(),
    payment_token_address: z.string(),
    name: z.string(),
    description: z.string(),
    banner: z.string(),
    start_date: z.number().int(),
    sale_start_date: z.number().int(),
    sale_end_date: z.number().int(),
    stream_link: z.string(),
    streamer_link: z.string(),
    price: z.string(),
    total_amount: z.number().int(),
    reserved_amount: z.number().int(),
    purchased: z.union([z.boolean(), z.null()]),
  })
  .passthrough();
const TicketSale = z
  .object({
    ticket_sale_addr: z.string(),
    token_payment_addr: z.string(),
    start_time: z.number().int(),
    end_time: z.number().int(),
    price: z.string(),
    owner: z.string(),
  })
  .passthrough();
const Ticket = z
  .object({
    cap: z.number().int(),
    total_supply: z.number().int(),
    ticket_addr: z.string(),
    name: z.string(),
    symbol: z.string(),
    token_uri: z
      .object({
        name: z.string(),
        description: z.string(),
        image: z.string(),
        attributes: z.array(z.string()),
      })
      .partial()
      .passthrough(),
  })
  .passthrough();
const Promo = z
  .object({
    owner_address: z.string(),
    promo_addr: z.string(),
    token_id: z.number().int(),
    name: z.string(),
    description: z.string(),
    cover: z.string(),
    link: z.string().optional(),
    shopping_link: z.string().optional(),
    start_date: z.number().int(),
    end_date: z.number().int(),
    ticket_sales: z.array(TicketSale),
    tickets: z.array(Ticket),
    created: z.number().int(),
  })
  .passthrough();

export const schemas = {
  to_block,
  ValidationError,
  HTTPValidationError,
  owner,
  Stream,
  TicketSale,
  Ticket,
  Promo,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/index/promo",
    alias: "index_promo_index_promo_post",
    requestFormat: "json",
    parameters: [
      {
        name: "from_block",
        type: "Query",
        schema: z.number().int().optional().default(37553211),
      },
      {
        name: "to_block",
        type: "Query",
        schema: to_block,
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "post",
    path: "/index/start",
    alias: "start_index_index_start_post",
    requestFormat: "json",
    parameters: [
      {
        name: "from_block",
        type: "Query",
        schema: z.number().int().optional().default(37553211),
      },
      {
        name: "to_block",
        type: "Query",
        schema: to_block,
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "post",
    path: "/index/ticket",
    alias: "index_ticket_index_ticket_post",
    requestFormat: "json",
    parameters: [
      {
        name: "from_block",
        type: "Query",
        schema: z.number().int().optional().default(37553211),
      },
      {
        name: "to_block",
        type: "Query",
        schema: to_block,
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/promo",
    alias: "all_promos_promo_get",
    requestFormat: "json",
    parameters: [
      {
        name: "stream",
        type: "Query",
        schema: owner,
      },
      {
        name: "owner",
        type: "Query",
        schema: owner,
      },
      {
        name: "offset",
        type: "Query",
        schema: z.unknown().optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.unknown().optional().default(25),
      },
    ],
    response: z.array(Promo),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/promo/my",
    alias: "my_promos_promo_my_get",
    requestFormat: "json",
    parameters: [
      {
        name: "buyer",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.unknown().optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.unknown().optional().default(25),
      },
    ],
    response: z.array(Promo),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/ticket",
    alias: "all_tickets_ticket_get",
    requestFormat: "json",
    parameters: [
      {
        name: "owner",
        type: "Query",
        schema: owner,
      },
      {
        name: "buyer",
        type: "Query",
        schema: owner,
      },
      {
        name: "offset",
        type: "Query",
        schema: z.unknown().optional(),
      },
      {
        name: "limit",
        type: "Query",
        schema: z.unknown().optional().default(25),
      },
    ],
    response: z.array(Stream),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
  {
    method: "get",
    path: "/ticket/:ticket_addr",
    alias: "get_stream_ticket__ticket_addr__get",
    requestFormat: "json",
    parameters: [
      {
        name: "ticket_addr",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "buyer",
        type: "Query",
        schema: owner,
      },
    ],
    response: z.union([Stream, z.null()]),
    errors: [
      {
        status: 422,
        description: `Validation Error`,
        schema: HTTPValidationError,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
