# TODO: Add maybe SqlLite repository just in case?

import abc
from typing import List, Optional
from pymemcache.client import base

from domain.models import NftData


class AbstractNftRepository(abc.ABC):

    @abc.abstractmethod
    def put(self, nft_data: NftData):
        raise NotImplementedError

    @abc.abstractmethod
    def get(self, nft_contract_id: str) -> Optional[NftData]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, nft_contract_id: str, nft_data: NftData):
        raise NotImplementedError

    @abc.abstractmethod
    def list_all(self) -> List[NftData]:
        raise NotImplementedError


class MemcacheNftRepository(AbstractNftRepository):

    def __init__(self, client: base.Client) -> None:
        super().__init__()

        self._client = client

    def put(self, nft_data: NftData):
        self._client.set(nft_data.contract_id, nft_data)

    def get(self, nft_contract_id: str) -> Optional[NftData]:
        return self._client.get(nft_contract_id)

    def update(self, nft_contract_id: str, nft_data: NftData):
        self._client.set(nft_contract_id, nft_data)


class AbstractWeb3Client(abc.ABC):

    @abc.abstractmethod
    def query_nft_data_by_contract(self):
        raise NotImplementedError

    @abc.abstractmethod
    def query_block_height(self) -> int:
        raise NotImplementedError

    @abc.abstractmethod
    def current_network(self) -> str:
        raise NotImplementedError


class NftIndexer:

    def __init__(
        self, web3_client: AbstractWeb3Client, repository: AbstractNftRepository
    ) -> None:
        self._web3_client = web3_client
        self._repository = repository

    def index_ticket_nft(self, contract_id):
        if self._repository.get(contract_id):
            return self._repository.get(contract_id)
        nft_data = self._web3_client.query_nft_data_by_contract(contract_id)
        self._repository.put(nft_data)

        return nft_data

    def index_ticket_collection(self):
        pass

    def index_promo_nft(self):
        pass
