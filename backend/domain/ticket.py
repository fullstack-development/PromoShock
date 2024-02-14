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
    ticket_id: str
    name: str
    symbol: str
    ticket_collection_addr: str

@dataclass(unsafe_hash=True)
class TicketSale:
    owner: str
    ticket_sale_addr: str
    ticket_addr: str
    block_nmb: int
    block_hash: str
    transaction_hash: str
    transaction_index: int