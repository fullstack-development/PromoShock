import abc
import logging
from typing import Any, List, Optional
from ens.ens import HexBytes
from eth_typing import Address
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from web3 import Web3
from web3.types import BlockParams, FilterParams, LogReceipt

from domain.promo import PromoCreatedEvent
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

    @abc.abstractmethod
    def commit(self):
        raise NotImplementedError


class SqlAlchemyRepository(AbstractRepository):

    def __init__(self, session: Session) -> None:
        self.session: Session = session

    def add(self, data):
        self.session.add(data)

    # TODO: update existing records if some txs were reverted by blockchain
    def update(self, model_name, filter_params, data):
        pass

    def filter(self, model_name, filter_params):
        return self.session.query(model_name).filter_by(**filter_params).all()

    def commit(self):
        try:
            self.session.commit()
        except SQLAlchemyError as err:
            self.session.rollback()
            raise err


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
    "0xd9b42bb096f4c62dfc76023d46bac952fbc443c1f23189362ce518e507e5d5ab": (
        "PromotionCreated",
        "(uint256,uint256,address,address[],string)",
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
            self._repository.commit()
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
            self._repository.commit()
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
            self._repository.commit()
        return ticket

    def _index_promo_created_event(self, log: LogReceipt, pattern: tuple[str]):
        # FIXME: why is it like that??
        start_time, end_time, promo_addr, streams, description = self.decode_data(
            [pattern], log["data"]
        )[0]
        event = PromoCreatedEvent(
            start_time=start_time,
            end_time=end_time,
            promo_addr=promo_addr,
            streams=streams,
            description=description,
            transaction_hash=log["transactionHash"].hex(),
            transaction_id=log["transactionIndex"],
            block_nmb=log["blockNumber"],
            block_hash=log["blockHash"].hex(),
        )
        logger.debug(event)
        if (
            self._repository.get(PromoCreatedEvent, {"promo_addr": event.promo_addr})
            is None
        ):
            self._repository.add(event)
            self._repository.commit()
        return event

    async def start_index(
        self, from_block: BlockParams = "earliest", to_block: BlockParams = "latest"
    ):
        logger.info(f"Start indexing from block '{from_block}' to block '{to_block}'")
        logs = self._web3.eth.get_logs(
            filter_params=FilterParams(
                address=self._contract.address, fromBlock=from_block, toBlock=to_block
            )
        )
        for log in logs:
            topic_name, pattern = self._log_events.get(
                log["topics"][0].hex(), (None, None)
            )
            if topic_name is None or pattern is None:
                continue
            topic_bytes = HexBytes(bytes().join(log["topics"][1:]))
            if topic_name == "TicketSaleCreated":
                ticket_sale_event = self._index_ticket_sale_created_event(
                    log, pattern, topic_bytes
                )
                self._index_ticket_sale(ticket_sale_event.ticket_sale_addr)
                self._index_ticket(ticket_sale_event.ticket_addr)
            elif topic_name == "PromotionCreated":
                self._index_promo_created_event(log, pattern)
                # self._index_promo(promo_created_event.promo_addr)

        logger.info("Index complete")

    def decode_data(self, pattern, topic):
        return self._web3.codec.decode(pattern, topic)
