## MetaStream smart-contracts

| Contract      | Address                                    | ABI                                               |
| ------------- | ------------------------------------------ | ------------------------------------------------- |
| TicketFactory | 0x2b771816c5FeF22f4553e1614A3bA0DfA1D24440 | [ABI](./abi/TicketFactory.sol/TicketFactory.json) |
| PromoFactory  | 0xf300c9bf1A045844f17B093a6D56BC33685e5D05 | [ABI](./abi/PromoFactory.sol/PromoFactory.json)   |
| Promo (NFT)   | 0xd409ffeb2f2e9dB0A75483a6417776CD6D7Ce774 | [ABI](./abi/Promo.sol/Promo.json)                 |

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

### Deploy

Common script

```shell
$ forge script script/<contract_name>.s.sol:<script_name> --rpc-url <rpc_url> --sig "<run_func_signature>" --private-key <your_private_key> --broadcast --etherscan-api-key <etherscan_api_key> --verify -vvvv
```

_Important!_ You may need to add the `0x` prefix to the private key (in `.env` file - [6070](https://github.com/foundry-rs/foundry/issues/6070)) before running the deployment scripts.

_Note!_ If you want to add an RPC for the blockchain, you need to add the rpc address to `.env` and to the `foundry.toml` settings.

#### Deploy order

1. Ticket.sol
2. TicketSale.sol
3. TicketFactory.sol (with Ticket and TicketSale implementation addresses), ProxyAdmin
4. PromoFactory.sol
5. Promo.sol (with PromoFactory address)

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
```                                                 |

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

-   TicketFactory.sol (proxy)
-   TicketFactory.sol (implementation)

````shell
$ forge script script/TicketFactory.s.sol \
--rpc-url <rpc_url> \
--sig "run(address,address,address,address,uint256,uint256)" \
<proxy_admin_owner_address> \
<ticket_sale_implementation_address> \
<ticket_implementation_address> \
<protocol_fee_recipient_address> \
<protocol_fee_amount> \
<max_sale_period> \
--broadcast \
--verify \
-vv
```

**For example**

```shell
$ forge script script/TicketFactory.s.sol \
--rpc-url localhost \
--sig "run(address,address,address,address,uint256,uint256)" \
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC \
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
1000 \
2592000 \
--broadcast \
--verify \
-vv
````

---

#### PromoFactory

Deploy contracts:

-   PromoFactory.sol (proxy)
-   PromoFactory.sol (implementation)

````shell
$ forge script script/PromoFactory.s.sol \
--rpc-url <rpc_url> \
--sig "run(address,address,address,uint256)" \
<proxy_admin_owner_address> \
<payment_token_address> \
<payment_recipient_address> \
<promo_creation_price_amount> \
--broadcast \
--verify \
-vv
```                                                 |

**For example**

```shell
$ forge script script/PromoFactory.s.sol \
--rpc-url localhost \
--sig "run(address,address,address,uint256)" \
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
1000000000000000000 \
--broadcast \
--verify \
-vv
````

---

#### Promo

Deploy contracts:

-   Promo.sol (proxy)
-   Promo.sol (implementation)

````shell
$ forge script script/Promo.s.sol \
--rpc-url <rpc_url> \
--sig "run(address,address,string)" \
<proxy_admin_address> \
<promo_factory_address> \
"<contract_uri>" \
--broadcast \
--verify \
-vv
```                                                 |

**For example**

```shell
$ forge script script/Promo.s.sol \
--rpc-url localhost \
--sig "run(address,address,string)" \
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
"ipfs://contractUri" \
--broadcast \
--verify \
-vv
````

---

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
