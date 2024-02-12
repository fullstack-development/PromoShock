import abc
from typing import Any, List, Optional
from ens.ens import HexBytes
from eth_typing import Address
from pymemcache.client import base
from web3 import Web3
from web3.types import FilterParams

from domain.models import NftData


class AbstractRepository(abc.ABC):

    @abc.abstractmethod
    def put(self, nft_data):
        raise NotImplementedError

    @abc.abstractmethod
    def get(self, nft_contract_id: str) -> Optional[Any]:
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, nft_contract_id: str, nft_data):
        raise NotImplementedError

    @abc.abstractmethod
    def list_all(self) -> List[Any]:
        raise NotImplementedError


class MemcacheNftRepository(AbstractRepository):

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


class NftIndexer:

    def __init__(
        self,
        web3_client: Web3,
        repository: AbstractRepository,
        contract_addr: Address,
        contract_abi: dict,
    ) -> None:
        self._web3 = web3_client
        self._repository = repository
        self._contract_abi = contract_abi
        self._contract = self._web3.eth.contract(contract_addr, abi=contract_abi)

    def index_ticket_sale(self):
        logs = self._web3.eth.get_logs(filter_params=FilterParams(address=self._contract.address, fromBlock=37494245))
        for log in logs:
            try:
                print(self.decode_log_topic(HexBytes(bytes().join(log['topics'][1:])))) # FIXME: dirty, need to parse the topic for method name
            except Exception as e:
                continue

    def decode_log_topic(self, data):
        decoded = self._web3.codec.decode(['address', 'address', 'address'], data) # TODO: parse first topic as well as pure bytes
        return decoded
            

    def index_nft_factory_collection(self):
        pass
