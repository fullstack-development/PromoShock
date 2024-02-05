from dataclasses import dataclass
from typing import List


@dataclass(frozen=True)
class Ticket:
    name: str
    symbol: str
    cap: int
    base_token_uri: str
    contract_uri: str
    owners: List[str]
