from dataclasses import dataclass


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
        return self.contract_id == value.contract_id
