class TicketCollection:
    trahsaction_hash: str
    name: str
    symbol: str
    base_token_uri: str
    cap: int

class Ticket:
    ticket_id: str
    name: str
    symbol: str
    ticket_collection_addr: str

class TicketSale:
    streamer: str
    ticket_sale_addr: str
    ticket_addr: str