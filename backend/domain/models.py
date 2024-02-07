from dataclasses import dataclass
from typing import List


@dataclass(frozen=True)
class Viewer:
    viewer_id: str

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Viewer):
            return False
        return self.viewer_id == other.viewer_id


@dataclass(frozen=True)
class NftData:
    contract_id: str
    owner: str
    uri: str
    name: str
    description: str
    external_url: str

    def __eq__(self, value: object) -> bool:
        if not isinstance(value, NftData):
            return False
        return self.uri == value.uri


@dataclass(frozen=True)
class NftCollection:
    contract_id: str
    uri: str
    name: str
    description: str
    nfts: List[NftData]

    def __eq__(self, value: object) -> bool:
        if not isinstance(value, NftCollection):
            return False
        return self.uri == value.uri
