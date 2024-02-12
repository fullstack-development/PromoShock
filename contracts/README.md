## MetaStream smart-contracts

| Contract                | Address                                    | ABI                                               |
| ----------------------- | ------------------------------------------ | ------------------------------------------------- |
| TicketFactory           | 0x42C593A0F50321EA473b5fAe6a4b76c212a26F54 | [ABI](./abi/TicketFactory.sol/TicketFactory.json) |
| TicketSale              |                                            | [ABI](./abi/TicketSale.sol/TicketSale.json)       |
| Ticket (NFT Collection) |                                            | [ABI](./abi/Ticket.sol/Ticket.json)               |
| PromoFactory            | 0x3d3E2D37151a812418FB075190f959a6C90C3A38 | [ABI](./abi/PromoFactory.sol/PromoFactory.json)   |
| Promo (NFT Collection)  | 0x0D790354b7887791df6dB035808ED8Fe4b41BE47 | [ABI](./abi/Promo.sol/Promo.json)                 |

## Description

### TicketFactory

#### Structs

##### SaleParams

```solidity
struct SaleParams {
    uint256 startTime;
    uint256 endTime;
    uint256 price;
    address paymentToken;
}
```

##### TicketParams

```solidity
struct TicketParams {
    string name;
    string symbol;
    string baseUri;
    uint16 cap;
}
```

#### Functions

##### createTicketSale

Creates a new ticket sale with specified sale and ticket parameters

_This function creates a collection of tickets and a smart contract to sell those tickets_

```solidity
function createTicketSale(SaleParams calldata sale, TicketParams calldata ticket)
    external
    returns (address ticketSaleAddr, address ticketAddr);
```

**Parameters**

| Name     | Type           | Description                                                              |
| -------- | -------------- | ------------------------------------------------------------------------ |
| `sale`   | `SaleParams`   | A `SaleParams` struct containing parameters for the sale                 |
| `ticket` | `TicketParams` | A `TicketParams` struct containing parameters for the tickets being sold |

**Returns**

| Name             | Type      | Description                                                        |
| ---------------- | --------- | ------------------------------------------------------------------ |
| `ticketSaleAddr` | `address` | The address of the newly created ticket sale contract              |
| `ticketAddr`     | `address` | The address of the ticket contract associated with the ticket sale |

#### Events

##### TicketSaleCreated

```solidity
event TicketSaleCreated(
    address indexed creator, address indexed ticketSaleAddr, address indexed ticketAddr
);
```

##### Sold

```solidity
event Sold(
    address indexed buyer, address indexed ticket, uint256 tokenId, uint256 price, uint256 timestamp
);
```

##### MintTicket

```solidity
event MintTicket(address indexed owner, uint256 tokenId);
```

### PromoFactory

#### Structs

##### Promotion

```solidity
struct Promotion {
    uint256 startTime;
    uint256 endTime;
    address promoAddr;
    address[] streams;
    string description;
}
```

#### Functions

##### createPromo

Creates a new promo with specified promotion details and URI

_This function calculates the price for creating a promo based
on the number of streams specified in the `promotion` struct,
multiplied by the `_promoCreationPrice`_

```solidity
function createPromo(Promotion calldata promotion, string calldata uri) external;
```

**Parameters**

| Name        | Type        | Description                                                  |
| ----------- | ----------- | ------------------------------------------------------------ |
| `promotion` | `Promotion` | A `Promotion` struct containing the details of the promotion |
| `uri`       | `string`    | The URI for the promo metadata                               |

#### Events

##### PromotionCreated

```solidity
event PromotionCreated(address indexed marketer, Promotion promotion);
```

##### MintPromo

```solidity
event MintPromo(address indexed owner, uint256 tokenId, Promotion promotion);
```

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Anvil

```shell
$ anvil
```

## Deploy

Common script

```shell
$ forge script script/<contract_name>.s.sol:<script_name> --rpc-url <rpc_url> --sig "<run_func_signature>" --private-key <your_private_key> --broadcast --etherscan-api-key <etherscan_api_key> --verify -vvvv
```

_Important!_ You may need to add the `0x` prefix to the private key (in `.env` file - [6070](https://github.com/foundry-rs/foundry/issues/6070)) before running the deployment scripts.

_Note!_ If you want to add an RPC for the blockchain, you need to add the rpc address to `.env` and to the `foundry.toml` settings.

#### Deploy scripts order

1. Ticket.s.sol
2. TicketSale.s.sol
3. TicketFactory.s.sol
4. TicketFactoryProxy.s.sol (with Ticket, TicketSale and TicketFactory implementation addresses)
5. Promo.s.sol
6. PromoFactory.s.sol
7. PromoFactoryProxy.s.sol
8. PromoProxy.s.sol (with PromoFactoryProxy address)

---

#### Ticket

Deploy contracts:

-   Ticket.sol (implementation)

````shell
$ forge script script/Ticket.s.sol \
--rpc-url <rpc_url> \
--broadcast \
--verify \
-vv
```

**For example**

```shell
$ forge script script/Ticket.s.sol \
--rpc-url localhost \
--broadcast \
--verify \
-vv
````

---

#### TicketSale

Deploy contracts:

-   TicketSale.sol (implementation)

````shell
$ forge script script/TicketSale.s.sol \
--rpc-url <rpc_url> \
--broadcast \
--verify \
-vv
```

**For example**

```shell
$ forge script script/TicketSale.s.sol \
--rpc-url localhost \
--broadcast \
--verify \
-vv
````

---

#### TicketFactory

Deploy contracts:

-   TicketFactory.sol (implementation)

````shell
$ forge script script/TicketFactory.s.sol \
--rpc-url <rpc_url> \
--broadcast \
--verify \
-vv
```

**For example**

```shell
$ forge script script/TicketFactory.s.sol \
--rpc-url localhost \
--broadcast \
--verify \
-vv
````

---

#### TicketFactoryProxy

Deploy contracts:

-   ProxyAdmin.sol
-   TransparentUpgradeableProxy.sol (TicketFactory)

````shell
$ forge script script/proxy/TicketFactoryProxy.s.sol \
--rpc-url <rpc_url> \
--sig "run(address,address,address,address,address,uint256,uint256)" \
<initial_owner_address>  \
<ticket_sale_implementation_address> \
<ticket_implementation_address> \
<ticket_factory_implementation_address> \
<protocol_fee_recipient_address> \
<protocol_fee_amount> \
<max_sale_period> \
--broadcast \
--verify \
-vv
```

**For example**

```shell
$ forge script script/proxy/TicketFactoryProxy.s.sol \
--rpc-url localhost \
--sig "run(address,address,address,address,address,uint256,uint256)" \
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC \
0xe7f1725e7734ce288f8367e1bb143e90bb3f0512 \
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
1000 \
2592000 \
--broadcast \
--verify \
-vv
````

---

#### Promo

Deploy contracts:

-   Promo.sol (implementation)

````shell
$ forge script script/Promo.s.sol \
--rpc-url <rpc_url> \
--broadcast \
--verify \
-vv
```

**For example**

```shell
$ forge script script/Promo.s.sol \
--rpc-url localhost \
--broadcast \
--verify \
-vv
````

---

#### PromoFactory

Deploy contracts:

-   PromoFactory.sol (implementation)

````shell
$ forge script script/PromoFactory.s.sol \
--rpc-url <rpc_url> \
--broadcast \
--verify \
-vv
```

**For example**

```shell
$ forge script script/PromoFactory.s.sol \
--rpc-url localhost \
--broadcast \
--verify \
-vv
````

---

#### PromoFactoryProxy

Deploy contracts:

-   ProxyAdmin.sol
-   TransparentUpgradeableProxy.sol (PromoFactory)

````shell
$ forge script script/proxy/PromoFactoryProxy.s.sol \
--rpc-url <rpc_url> \
--sig "run(address,address,address,address,uint256)" \
<initial_owner_address> \
<promo_factory_implementation_address> \
<payment_token_address> \
<payment_recipient_address> \
<promo_creation_price_amount> \
--broadcast \
--verify \
-vv
```                                                 |

**For example**

```shell
$ forge script script/proxy/PromoFactoryProxy.s.sol \
--rpc-url localhost \
--sig "run(address,address,address,address,uint256)" \
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
0x90F79bf6EB2c4f870365E785982E1f101E93b906 \
0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
1000000000000000000 \
--broadcast \
--verify \
-vv
````

---

#### PromoProxy

Deploy contracts:

-   ProxyAdmin.sol
-   TransparentUpgradeableProxy.sol (Promo)

````shell
$ forge script script/proxy/PromoProxy.s.sol \
--rpc-url <rpc_url> \
--sig "run(address,address,address,string)" \
<initial_owner_address> \
<promo_implementation_address> \
<promo_factory_address> \
"<contract_uri>" \
--broadcast \
--verify \
-vv
```                                                 |

**For example**

```shell
$ forge script script/proxy/PromoProxy.s.sol \
--rpc-url localhost \
--sig "run(address,address,address,string)" \
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
0x90F79bf6EB2c4f870365E785982E1f101E93b906 \
0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
"ipfs://contractUri" \
--broadcast \
--verify \
-vv
````

---

## Cast

```shell
$ cast <subcommand>
```

## Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
