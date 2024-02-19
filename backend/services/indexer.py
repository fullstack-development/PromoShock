import abc
import logging
from typing import Any, List, Optional
from ens.ens import HexBytes
from eth_typing import Address
import requests
from urllib.parse import urlparse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from web3 import Web3
from web3.types import BlockParams, FilterParams, LogReceipt

from domain.promo import Promo, PromoCreatedEvent, PromoToTicket
from contracts.abi import get_ticket_abi, get_ticket_sale_abi, get_promo_abi
from domain.ticket import Ticket, TicketSale, TicketSaleCreatedEvent

logger = logging.getLogger(__name__)


class AbstractRepository(abc.ABC):

    @abc.abstractmethod
    def add(self, data):
        raise NotImplementedError

    @abc.abstractmethod
    def filter(
        self, model_name, filter_params: dict, offset: int = 0, limit: int = 25
    ) -> List[Any]:
        raise NotImplementedError

    def get(self, model_name, filter_params: dict) -> Optional[Any]:
        entities = self.filter(model_name, filter_params)
        if len(entities) != 1 or len(entities) > 1:  # FIXME: is this right?
            return None
        return entities[0]

    @abc.abstractmethod
    def commit(self):
        raise NotImplementedError


# TODO: implement transactions
class SqlAlchemyRepository(AbstractRepository):

    def __init__(self, session: Session) -> None:
        self.session: Session = session

    def add(self, data):
        self.session.add(data)

    def filter(self, model_name, filter_params, offset=0, limit=25):
        return (
            self.session.query(model_name)
            .filter_by(**filter_params)
            .limit(limit)
            .offset(offset)
            .all()
        )

    def filter_in(self, model_name, field, param, filter_params={}, offset=0, limit=25):
        return self.session.query(model_name).filter(field.in_(param)).filter_by(**filter_params).limit(limit).offset(offset).all()

    def commit(self):
        try:
            self.session.commit()
        except SQLAlchemyError as err:
            self.session.rollback()
            logger.error(err)
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
                {"ticket_sale_addr": ticket_sale_addr.lower(), "ticket_addr": ticket_addr.lower()},
            )
            is None
        ):
            self._repository.add(event)
            self._repository.commit()
        return event

    def _index_ticket_sale(self, ticket_sale_addr, owner):
        contract = self._web3.eth.contract(
            self._web3.to_checksum_address(ticket_sale_addr), abi=get_ticket_sale_abi()
        )
        start_time, end_time, price, token_payment_addr = contract.functions.getSaleParams().call()

        ticket_sale = TicketSale(
            ticket_sale_addr=ticket_sale_addr.lower(),
            start_time=start_time,
            end_time=end_time,
            price=str(price),
            owner=owner.lower(),
            token_payment_addr=token_payment_addr,
        )
        if (
            self._repository.get(TicketSale, {"ticket_sale_addr": ticket_sale_addr.lower()})
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
        total_supply = contract.functions.totalSupply().call()
        try:
            uri = self._get_ipfs_data(contract.functions.tokenURI(0).call())
        except requests.JSONDecodeError:
            uri = {}
        ticket = Ticket(
            ticket_addr=ticket_addr.lower(),
            name=name,
            symbol=symbol,
            token_uri=uri,
            cap=cap,
            total_supply=total_supply,
        )
        if self._repository.get(Ticket, {"ticket_addr": ticket_addr.lower()}) is None:
            self._repository.add(ticket)
            self._repository.commit()
        return ticket

    def _index_promo_created_event(self, log: LogReceipt, pattern: tuple[str]):
        [owner] = self.decode_data(["address"], log["topics"][1])
        start_time, end_time, promo_addr, streams, description = self.decode_data(
            [pattern], log["data"]
        )[0]
        event = PromoCreatedEvent(
            start_time=start_time,
            end_time=end_time,
            owner=owner.lower(),
            promo_addr=promo_addr.lower(),
            streams=streams,
            description=description,
            transaction_hash=log["transactionHash"].hex(),
            transaction_id=log["transactionIndex"],
            block_nmb=log["blockNumber"],
            block_hash=log["blockHash"].hex(),
        )
        if (
            self._repository.get(PromoCreatedEvent, {"promo_addr": event.promo_addr.lower()})
            is None
        ):
            self._repository.add(event)
            self._repository.commit()
        return event

    def _index_promo(
        self,
        promo_created_event: PromoCreatedEvent,
        from_block: BlockParams = "earliest",
        to_block: BlockParams = "latest",
    ):
        logs = self._web3.eth.get_logs(
            filter_params=FilterParams(
                address=self._web3.to_checksum_address(promo_created_event.promo_addr),
                fromBlock=from_block,
                toBlock=to_block,
            )
        )

        for log in logs:
            try:
                # TODO: parse MintPromo event
                payment_token_addr, tokenId = self.decode_data(
                    ("address", "uint256"), HexBytes(bytes().join(log["topics"][1:]))
                )
                start_time, end_time, promo_addr, streams, description = (
                    self.decode_data(
                        ["(uint256,uint256,address,address[],string)"], log["data"]
                    )[0]
                )
                contract = self._web3.eth.contract(
                    self._web3.to_checksum_address(promo_addr), abi=get_promo_abi()
                )
                try:
                    uri = self._get_ipfs_data(
                        contract.functions.tokenURI(tokenId).call()
                    )
                except requests.JSONDecodeError:
                    uri = {}
                promo = Promo(
                    owner=promo_created_event.owner.lower(),
                    payment_token_addr=payment_token_addr.lower(),
                    token_id=tokenId,
                    start_time=start_time,
                    end_time=end_time,
                    promo_addr=promo_addr.lower(),
                    description=description,
                    uri=uri,
                )
                if (
                    self._repository.get(
                        Promo, {"promo_addr": promo_addr.lower(), "token_id": tokenId}
                    )
                ) is None:
                    self._repository.add(promo)
                    self._repository.commit()
                    logger.info(f"Promo {promo.promo_addr}#{promo.token_id} was saved")
                for stream_addr in streams:
                    promo_to_ticket = PromoToTicket(
                        promo_addr=promo_addr.lower(), ticket_addr=stream_addr.lower(), token_id=tokenId
                    )
                    if (
                        self._repository.get(
                            PromoToTicket,
                            {
                                "promo_addr": promo_addr.lower(),
                                "ticket_addr": stream_addr.lower(),
                                "token_id": tokenId,
                            },
                        )
                        is None
                    ):
                        self._repository.add(promo_to_ticket)
                        self._repository.commit()
                return promo
            except Exception as err:
                continue

    def _get_ipfs_data(self, url):
        parsed_url = urlparse(url)
        if parsed_url.scheme == "ipfs":
            return requests.get(f"https://ipfs.io/ipfs/{parsed_url.netloc}").json()
        else:
            return requests.get(url).json()

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
                self._index_ticket_sale(ticket_sale_event.ticket_sale_addr, ticket_sale_event.owner)
                self._index_ticket(ticket_sale_event.ticket_addr)
            elif topic_name == "PromotionCreated":
                promo_created_event = self._index_promo_created_event(log, pattern)
                self._index_promo(
                    promo_created_event, from_block=from_block, to_block=to_block
                )

        logger.info("Index complete")

    def decode_data(self, pattern, data):
        return self._web3.codec.decode(pattern, data)
