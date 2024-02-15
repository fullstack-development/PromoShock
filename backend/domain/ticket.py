from dataclasses import dataclass


@dataclass(unsafe_hash=True)
class TicketCollection:
    trahsaction_hash: str
    name: str
    symbol: str
    base_token_uri: str
    cap: int


@dataclass(unsafe_hash=True)
class Ticket:
    ticket_addr: str
    name: str
    symbol: str
    token_uri: str  # TODO: save as a dict?
    cap: int


@dataclass(unsafe_hash=True)
class TicketSale:
    ticket_sale_addr: str
    start_time: int
    end_time: int
    price: str
    owner: str


@dataclass(unsafe_hash=True)
class TicketSaleCreatedEvent:
    owner: str
    ticket_sale_addr: str
    ticket_addr: str
    block_nmb: int
    block_hash: str
    transaction_hash: str
    transaction_index: int

