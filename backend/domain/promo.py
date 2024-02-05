from dataclasses import dataclass
from datetime import date
from typing import List

from domain.stream import Stream


@dataclass(frozen=True)
class Promo:
    start_time: date
    end_time: date
    promo_address: str
    streams: List[Stream]
    description: str
