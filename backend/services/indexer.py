import abc
from typing import Any, List, Optional
from ens.ens import HexBytes
from eth_typing import Address
from pymemcache.client import base
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from web3 import Web3
from web3.types import BlockParams, FilterParams

from domain.models import NftData
from domain.ticket import TicketSale


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
        self._client.set(
            f"{nft_data.transaction_hash}#{nft_data.transaction_index}", nft_data
        )

    def get(self, nft_contract_id: str) -> Optional[NftData]:
        return self._client.get(nft_contract_id)

    def update(self, nft_contract_id: str, nft_data: NftData):
        self._client.set(nft_contract_id, nft_data)

    def list_all(self) -> List[NftData]:
        return []


class SqlAlchemyRepository(AbstractRepository):

    def __init__(self, session: Session) -> None:
        self.session: Session = session

    def put(self, data):
        try:
            self.session.add(data)
            self.session.commit()
        except Exception as err:
            self.session.rollback()
            raise err

    def get(self, model_name, tx_hash, tx_id):
        self.session.query(model_name).filter_by(
            transaction_hash=tx_hash, transaction_id=tx_id
        ).one()

    def update(self, nft_contract_id: str, nft_data):
        pass

    def list_all(self):
        pass


# TODO: use Keccak256 hashing
TESTNET_LOG_EVENTS = {
    "0xab6f6362a4c4773e481af1c0785512939f451906d627aad90f9798f7ec52dd2e": (
        "TicketSaleCreated",
        (
            "address",
            "address",
            "address",
        ),
    ),
}


class NftIndexer:

    def __init__(
        self,
        web3_client: Web3,
        repository: AbstractRepository,
        contract_addr: Address,
        contract_abi: dict,
        log_events: dict = TESTNET_LOG_EVENTS,
    ) -> None:
        self._web3 = web3_client
        self._repository = repository
        self._contract_abi = contract_abi
        self._log_events: dict = log_events

        self._contract = self._web3.eth.contract(contract_addr, abi=contract_abi)

    # TODO: trigger index for TicketSale and Ticket contract
    def _index_ticket_sale(self, log, pattern, data):
        owner, ticket_sale_addr, ticket_addr = self.decode_log_topic(pattern, data)
        try:
            self._repository.put(
                TicketSale(
                    owner=owner,
                    ticket_sale_addr=ticket_sale_addr,
                    ticket_addr=ticket_addr,
                    block_nmb=log["blockNumber"],
                    block_hash=log["blockHash"].hex(),
                    transaction_hash=log["transactionHash"].hex(),
                    transaction_index=log["transactionIndex"],
                )
            )
            print(
                f"TicketSale '{log['transactionHash'].hex()}#{log['transactionIndex']}' succesfully indexed"
            )
        except IntegrityError:  # Already exists in DB, ingoring
            pass

    # TODO: index PromoSale contract
    def start_index(
        self, from_block: BlockParams = "earliest", to_block: BlockParams = "latest"
    ):
        logs = self._web3.eth.get_logs(
            filter_params=FilterParams(
                address=self._contract.address, fromBlock=from_block, toBlock=to_block
            )
        )
        for log in logs:
            topic_name, topic_pattern = self._log_events.get(
                log["topics"][0].hex(), (None, None)
            )
            if topic_name is None or topic_pattern is None:
                continue
            topic_bytes = HexBytes(bytes().join(log["topics"][1:]))
            if topic_name == "TicketSaleCreated":
                self._index_ticket_sale(log, topic_pattern, topic_bytes)

    def decode_log_topic(self, pattern, topic):
        return self._web3.codec.decode(pattern, topic)
