from dataclasses import dataclass
from datetime import date
from typing import List


@dataclass(unsafe_hash=True)
class PromoCreatedEvent:
    start_time: date
    end_time: date
    promo_addr: str
    streams: List[str]
    description: str
    transaction_hash: str
    transaction_id: int
    block_hash: str
    block_nmb: int
