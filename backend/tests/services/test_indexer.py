from domain.models import NftData
from services.indexer import AbstractNftRepository, AbstractWeb3Client, NftIndexer
from typing import Set, Optional, List


class FakeNftRepository(AbstractNftRepository):
    _nfts: Set[NftData] = set()

    def __init__(self, nfts=None) -> None:
        self._nfts = set(nfts)

    def put(self, nft_data: NftData):
        self._nfts.add(nft_data)

    def get(self, nft_contract_id: str) -> Optional[NftData]:
        nft = [n for n in self._nfts if n.contract_id == nft_contract_id]
        return nft[0] if len(nft) == 1 else None

    def update(self, nft_contract_id: str, nft_data: NftData):
        return super().update(nft_contract_id, nft_data)

    def list_all(self) -> List[NftData]:
        return super().list_all()

    @staticmethod
    def from_nfts(nfts: List[NftData]):
        return FakeNftRepository(nfts)


class FakeWeb3Client(AbstractWeb3Client):
    def query_block_height(self) -> int:
        return super().query_block_height()

    def query_nft_data_by_contract(self, contract_id):
        return fake_nft(contract_id)

    def current_network(self) -> str:
        return super().current_network()


def fake_nft(contract_id):
    return NftData(
        contract_id=contract_id,
        owner="",
        uri="",
        name="",
        description="",
        external_url="",
    )


def test_should_index_nft_ticket():
    repo = FakeNftRepository()
    web3_client = FakeWeb3Client()
    indexer = NftIndexer(web3_client=web3_client, repository=repo)
    contract_id = "contract-id"

    indexed_nft = indexer.index_ticket_nft(contract_id)

    assert indexed_nft is not None
    assert indexed_nft.contract_id == contract_id


def test_should_return_nft_data_from_indexed_repo():
    repo = FakeNftRepository.from_nfts(
        [fake_nft("nft1"), fake_nft("nft2"), fake_nft("nft3")]
    )
    web3_client = FakeWeb3Client()
    indexer = NftIndexer(web3_client, repo)
    


def test_should_index_nft_ticket_collection():
    pass


def test_should_index_nft_promo():
    pass
