from domain.models import NftData
from services.indexer import AbstractNftRepository, AbstractWeb3Client, NftIndexer
from typing import Set, Optional, List


class FakeNftRepository(AbstractNftRepository):
    _nfts: Set[NftData] = set()

    def put(self, nft_data: NftData):
        self._nfts.add(nft_data)

    def get(self, nft_contract_id: str) -> Optional[NftData]:
        nft = [n for n in self._nfts if n.contract_id == nft_contract_id]
        return nft[0] if len(nft) == 1 else None

    def update(self, nft_contract_id: str, nft_data: NftData):
        return super().update(nft_contract_id, nft_data)

    def list_all(self) -> List[NftData]:
        return super().list_all()


class FakeWeb3Client(AbstractWeb3Client):
    def query_block_height(self) -> int:
        return super().query_block_height()

    def query_nft_data_by_contract(self, contract_id):

        return NftData(
            contract_id=contract_id,
            owner="",
            uri="",
            name="",
            description="",
            external_url="",
        )

    def current_network(self) -> str:
        return super().current_network()


def test_should_index_nft_ticket():
    repo = FakeNftRepository()
    web3_client = FakeWeb3Client()
    indexer = NftIndexer(web3_client=web3_client, repository=repo)
    contract_id = "contract-id"

    indexer.index_ticket_nft(contract_id)

    indexed_ticket = repo.get(contract_id)

    assert indexed_ticket is not None
    assert indexed_ticket.contract_id == contract_id


def test_should_index_nft_ticket_collection():
    pass


def test_should_index_nft_promo():
    pass
