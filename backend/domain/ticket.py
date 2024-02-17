from dataclasses import dataclass

from eth_typing import Address


@dataclass(unsafe_hash=True)
class TicketCollection:
    trahsaction_hash: str
    name: str
    symbol: str
    base_token_uri: str
    cap: int


@dataclass(unsafe_hash=True)
class Ticket:
    ticket_addr: Address
    name: str
    symbol: str
    token_uri: str  # TODO: save as a dict?
    cap: int


@dataclass(unsafe_hash=True)
class TicketSale:
    ticket_sale_addr: Address
    start_time: int
    end_time: int
    price: str
    owner: Address


@dataclass(unsafe_hash=True)
class TicketSaleCreatedEvent:
    owner: Address
    ticket_sale_addr: Address
    ticket_addr: Address
    block_nmb: int
    block_hash: str
    transaction_hash: str
    transaction_index: int
