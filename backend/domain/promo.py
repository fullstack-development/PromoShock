from dataclasses import dataclass
from datetime import date
from typing import List

from eth_typing import Address


@dataclass(unsafe_hash=True)
class PromoCreatedEvent:
    start_time: date
    owner: Address
    end_time: date
    promo_addr: Address
    streams: List[Address]
    description: str
    transaction_hash: str
    transaction_id: int
    block_hash: str
    block_nmb: int


@dataclass(unsafe_hash=True)
class Promo:
    owner: Address
    payment_token_addr: Address
    token_id: int
    start_time: int
    end_time: int
    promo_addr: Address
    description: str
    uri: dict


@dataclass(unsafe_hash=True)
class PromoToTicket:
    promo_addr: Address
    ticket_addr: Address
    token_id: int
