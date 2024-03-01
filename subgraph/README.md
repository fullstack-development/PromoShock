# Subgraph

## Links

- [hosted-service](https://thegraph.com/hosted-service/subgraph/rlkvrv/promoshock)
- [GraphQL API](https://api.thegraph.com/subgraphs/name/rlkvrv/promoshock)
- [Queries](#queries)
    - [Stream](#stream)
    - [Promo](#promos)
- [Entities](#entities)
- [The graph docs](https://thegraph.com/docs/en/deploying/hosted-service/)

## Queries

### Stream

-   I created

```graphql
query StreamsThatICreated(
    $owner: Bytes = "0x32bb35Fc246CB3979c4Df996F18366C6c753c29c"
    $first: Int = 10
    $skip: Int = 0
) {
    streams(
        where: { owner: $owner }
        orderBy: blockTimestamp
        first: $first
        skip: $skip
    ) {
        metadata {
            banner
            description
            external_link
            image
            name
            start_time
            stream_link
            streamer_link
        }
        owner
        price
        paymentTokenAddress
        reservedAmount
        purchased
        saleAddress
        saleEndDate
        saleStartDate
        ticketAddress
        totalAmount
        blockTimestamp
    }
}
```

-   I bought

```graphql
query TicketsThatIBought(
    $buyer: Bytes = "0x32bb35Fc246CB3979c4Df996F18366C6c753c29c"
    $first: Int = 10
    $skip: Int = 0
) {
    solds(
        where: { buyer: $buyer }
        orderBy: blockTimestamp
        first: $first
        skip: $skip
    ) {
        tokenId
        ticketMetadata {
            banner
            description
            external_link
            image
            name
            start_time
            stream_link
            streamer_link
        }
        ticket {
            address
        }
        price
        blockTimestamp
    }
}
```

### Promos

-   I created

```graphql
query PromosQueryForOwner(
    $owner: Bytes = "0x32bb35Fc246CB3979c4Df996F18366C6c753c29c"
    $first: Int = 10
    $skip: Int = 0
) {
    promos(
        where: { marketer: $owner }
        orderBy: blockTimestamp
        first: $first
        skip: $skip
    ) {
        marketer
        tickets
        metadata {
            description
            name
            cover
            shoppingLink
        }
        tokenId
        startDate
        tokenAddress
        tokenUri
    }
}
```

-   I bought

```graphql
query PromoThatIBought(
    $buyer: Bytes = "0x32bb35Fc246CB3979c4Df996F18366C6c753c29c"
    $first: Int = 10
    $skip: Int = 0
) {
    solds(
        where: { buyer: $buyer }
        orderBy: blockTimestamp
        first: $first
        skip: $skip
    ) {
        ticket {
            promos {
                tokenAddress
                startDate
                endDate
                tokenId
                tokenUri
                metadata {
                    cover
                    description
                    name
                    shoppingLink
                }
            }
            address
        }
    }
}
```

-   stream

```graphql
query StreamQuery(
    $saleAddress: Bytes = "0x5BEaE7367fDdB72817782FB384afDe04CE784F3a"
    $first: Int = 10
    $skip: Int = 0
) {
    streams(
        where: { saleAddress: $saleAddress }
        orderBy: blockTimestamp
        first: $first
        skip: $skip
    ) {
        metadata {
            banner
            description
            external_link
            image
            name
            start_time
            stream_link
            streamer_link
        }
        blockTimestamp
        owner
        paymentTokenAddress
        price
        purchased
        reservedAmount
        saleAddress
        saleEndDate
        saleStartDate
        ticketAddress
        totalAmount
    }
}
```

-   streams

```graphql
query StreamQuery($first: Int = 10, $skip: Int = 0) {
    streams(orderBy: blockTimestamp, first: $first, skip: $skip) {
        metadata {
            banner
            description
            external_link
            image
            name
            start_time
            stream_link
            streamer_link
        }
        blockTimestamp
        owner
        paymentTokenAddress
        price
        purchased
        reservedAmount
        saleAddress
        saleEndDate
        saleStartDate
        ticketAddress
        totalAmount
    }
}
```

## Entities

```bash
type TicketSaleCreated @entity(immutable: true) {
    id: ID!
    creator: Bytes! # address
    ticketSaleAddr: Bytes! # address
    ticketAddr: Bytes! # address
    blockNumber: BigInt!
    blockTimestamp: BigInt!
}

# ================== Ticket ========================

type Ticket @entity {
    id: ID!
    address: Bytes!
    sold: Sold!
    promos: [Promo!]!
}

type TicketMetadata @entity(immutable: true) {
    id: ID!
    name: String!
    description: String!
    start_time: BigInt!
    stream_link: String!
    streamer_link: String!
    image: String!
    banner: String!
    external_link: String!
}

type MintTicket @entity(immutable: true) {
    id: ID!
    owner: Bytes! # address
    tokenId: BigInt! # uint256
    blockNumber: BigInt!
    blockTimestamp: BigInt!
    transactionHash: Bytes!
}

# ================== Stream ======================

type Stream @entity {
    id: ID!
    owner: Bytes!
    saleAddress: Bytes!
    ticketAddress: Bytes!
    paymentTokenAddress: Bytes!
    price: BigInt!
    saleStartDate: BigInt!
    saleEndDate: BigInt!
    totalAmount: Int!
    reservedAmount: Int! #updatable
    metadata: TicketMetadata!
    purchased: Boolean! #updatable
    blockNumber: BigInt!
    blockTimestamp: BigInt!
    transactionHash: Bytes!
}

#============== Promo =====================

type Promo @entity {
    id: ID!
    marketer: Bytes!
    tokenId: BigInt!
    tickets: [Bytes!]!
    ticketAddressStr: String!
    tokenAddress: Bytes!
    tokenUri: String!
    metadata: PromoMetadata!
    startDate: BigInt!
    endDate: BigInt!
    blockNumber: BigInt!
    blockTimestamp: BigInt!
}

type PromoMetadata @entity {
    id: ID!
    name: String!
    description: String!
    cover: String!
    shoppingLink: String!
}

# ============= Sold =================

type Sold @entity {
    id: ID!
    buyer: Bytes! # address
    ticket: Ticket! @derivedFrom(field: "sold")
    tokenId: BigInt! # uint256
    price: BigInt! # uint256
    ticketMetadata: TicketMetadata!
    blockNumber: BigInt!
    blockTimestamp: BigInt!
    transactionHash: Bytes!
}

```
