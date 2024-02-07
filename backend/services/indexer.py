# TODO: Add maybe SqlLite repository just in case?

import abc
from typing import List, Optional
from pymemcache.client import base
from web3 import Web3

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

    def list_all(self) -> List[NftData]:
        return []


class AbstractWeb3Client(abc.ABC):

    @abc.abstractmethod
    def query_nft_data_by_contract(self, contract_id, contract_abi):
        raise NotImplementedError

    @abc.abstractmethod
    def query_block_height(self) -> int:
        raise NotImplementedError


class BNBWeb3Client(AbstractWeb3Client):

    def __init__(self, rpc_url: str) -> None:
        self._web3 = Web3(Web3.HTTPProvider(rpc_url))

    def query_nft_data_by_contract(self, contract_id, contract_abi):
        nft_contract = self._web3.eth.contract(contract_id, abi=contract_abi)
        print(f"Available funcitons {nft_contract.all_functions()}")
        return None

    def query_block_height(self) -> int:
        return self._web3.eth.block_number


class NftIndexer:

    def __init__(
        self,
        web3_client: AbstractWeb3Client,
        repository: AbstractNftRepository,
        contract_id: str,
        contract_abi: str,
        contract_factory_id: Optional[str],
    ) -> None:
        self._web3_client = web3_client
        self._repository = repository
        self._contract_id = contract_id
        self._contract_factory_id = contract_factory_id
        self._contract_abi = contract_abi

    def index_nft(self):
        if self._repository.get(self._contract_id):
            return self._repository.get(self._contract_id)
        nft_data = self._web3_client.query_nft_data_by_contract(
            self._contract_id, self._contract_abi
        )
        self._repository.put(nft_data)

        return nft_data

    def index_nft_factory_collection(self):
        pass
