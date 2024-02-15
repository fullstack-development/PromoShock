import abc
import logging
from typing import Any, List, Optional
from ens.ens import HexBytes
from eth_typing import Address
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from web3 import Web3
from web3.types import BlockParams, FilterParams

from contracts.abi import get_ticket_abi, get_ticket_sale_abi

from domain.ticket import Ticket, TicketSale, TicketSaleCreatedEvent

logger = logging.getLogger(__name__)


class AbstractRepository(abc.ABC):

    @abc.abstractmethod
    def add(self, data):
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, model_name, filter_params: dict, data: Any):
        raise NotImplementedError

    @abc.abstractmethod
    def filter(self, model_name, filter_params: dict) -> List[Any]:
        raise NotImplementedError

    def get(self, model_name, filter_params: dict) -> Optional[Any]:
        entities = self.filter(model_name=model_name, filter_params=filter_params)
        if len(entities) != 1 or len(entities) > 1:  # FIXME: is this right?
            return None
        return entities[0]


class SqlAlchemyRepository(AbstractRepository):

    def __init__(self, session: Session) -> None:
        self.session: Session = session

    def add(self, data):
        try:
            self.session.add(data)
            self.session.commit()
        except SQLAlchemyError as err:
            self.session.rollback()
            raise err

    # TODO: update existing records if some txs were reverted by blockchain
    def update(self, model_name, filter_params, data):
        pass

    def filter(self, model_name, filter_params):
        return self.session.query(model_name).filter_by(**filter_params).all()


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


# TODO: Record each index action as event source data
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
        self._log_events: dict = log_events

        self._contract = self._web3.eth.contract(contract_addr, abi=contract_abi)

    def _index_ticket_sale_created_event(self, log, pattern, data):
        owner, ticket_sale_addr, ticket_addr = self.decode_data(pattern, data)
        event = TicketSaleCreatedEvent(
            owner=owner,
            ticket_sale_addr=ticket_sale_addr,
            ticket_addr=ticket_addr,
            block_nmb=log["blockNumber"],
            block_hash=log["blockHash"].hex(),
            transaction_hash=log["transactionHash"].hex(),
            transaction_index=log["transactionIndex"],
        )
        if (
            self._repository.get(
                TicketSaleCreatedEvent,
                {"ticket_sale_addr": ticket_sale_addr, "ticket_addr": ticket_addr},
            )
            is None
        ):
            self._repository.add(event)
        return event

    def _index_ticket_sale(self, ticket_sale_addr):
        contract = self._web3.eth.contract(
            self._web3.to_checksum_address(ticket_sale_addr), abi=get_ticket_sale_abi()
        )
        start_time, end_time, price, owner = contract.functions.getSaleParams().call()

        ticket_sale = TicketSale(
            ticket_sale_addr=ticket_sale_addr,
            start_time=start_time,
            end_time=end_time,
            price=str(price),
            owner=owner,
        )
        if (
            self._repository.get(TicketSale, {"ticket_sale_addr": ticket_sale_addr})
            is None
        ):
            self._repository.add(ticket_sale)
        return ticket_sale

    def _index_ticket(self, ticket_addr):
        contract = self._web3.eth.contract(
            self._web3.to_checksum_address(ticket_addr), abi=get_ticket_abi()
        )
        name = contract.functions.name().call()
        cap = contract.functions.CAP().call()
        symbol = contract.functions.symbol().call()
        token_uri = contract.functions.tokenURI(0).call()
        ticket = Ticket(
            ticket_addr=ticket_addr,
            name=name,
            symbol=symbol,
            token_uri=token_uri,
            cap=cap,
        )
        if self._repository.get(Ticket, {"ticket_addr": ticket_addr}) is None:
            self._repository.add(ticket)
        return ticket

    def start_index(
        self, from_block: BlockParams = "earliest", to_block: BlockParams = "latest"
    ):
        logger.info(
            f"Start indexing TicketSale and PromoSale from block '{from_block}' to block '{to_block}'"
        )
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
                ticket_sale_event = self._index_ticket_sale_created_event(
                    log, topic_pattern, topic_bytes
                )
                self._index_ticket_sale(ticket_sale_event.ticket_sale_addr)
                self._index_ticket(ticket_sale_event.ticket_addr)
        logger.info("Index complete")

    def decode_data(self, pattern, topic):
        return self._web3.codec.decode(pattern, topic)
