import abc
import logging
import asyncio
from typing import Any, List, Optional
from ens.ens import HexBytes
from eth_abi.decoding import InsufficientDataBytes
from eth_typing import Address
import requests
from urllib.parse import urlparse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from web3 import AsyncWeb3
from web3.types import BlockIdentifier, FilterParams, LogReceipt

from domain.promo import Promo, PromoCreatedEvent, PromoToTicket
from contracts.abi import get_ticket_abi, get_ticket_sale_abi, get_promo_abi
from domain.ticket import Ticket, TicketBoughtEvent, TicketSale, TicketSaleCreatedEvent

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
# TODO: async methods
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
        return (
            self.session.query(model_name)
            .filter(field.in_(param))
            .filter_by(**filter_params)
            .limit(limit)
            .offset(offset)
            .all()
        )

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
    "0xa34e6b78e9a990f62e47ba1c3993ff82d0d748e22617d46c5a79c7b86d10e19b": (
        "MintTicket",
        ["address"],
    ),
    "0xe20902879f47c9f734b76d32be336010f7b3255d44e1564663803fac43d06cf5": (
        "MintPromo",
        ["address"],
    ),
}


# TODO: Record each index action as event source data
class NftIndexer:

    def __init__(
        self,
        web3_client: AsyncWeb3,
        repository: AbstractRepository,
        contract_addr: Address,
        contract_abi: dict,
        log_events: dict = TESTNET_LOG_EVENTS,
    ) -> None:
        self._web3 = web3_client
        self._repository = repository
        self._log_events: dict = log_events

        self._contract = self._web3.eth.contract(contract_addr, abi=contract_abi)

    async def _index_ticket_sale_created_event(self, log, pattern, data):
        owner, ticket_sale_addr, ticket_addr = self.decode_data(pattern, data)
        event = TicketSaleCreatedEvent(
            owner=owner.lower(),
            ticket_sale_addr=ticket_sale_addr.lower(),
            ticket_addr=ticket_addr.lower(),
            block_nmb=log["blockNumber"],
            block_hash=log["blockHash"].hex(),
            transaction_hash=log["transactionHash"].hex(),
            transaction_index=log["transactionIndex"],
        )
        if (
            self._repository.get(
                TicketSaleCreatedEvent,
                {
                    "ticket_sale_addr": ticket_sale_addr.lower(),
                    "ticket_addr": ticket_addr.lower(),
                },
            )
            is None
        ):
            self._repository.add(event)
            self._repository.commit()
        return event

    async def _index_ticket_sale(self, ticket_sale_addr, owner):
        contract = self._web3.eth.contract(
            self._web3.to_checksum_address(ticket_sale_addr),
            abi=get_ticket_sale_abi(),
        )
        start_time, end_time, price, token_payment_addr = (
            await contract.functions.getSaleParams().call()
        )

        ticket_sale = TicketSale(
            ticket_sale_addr=ticket_sale_addr.lower(),
            start_time=start_time,
            end_time=end_time,
            price=str(price),
            owner=owner.lower(),
            token_payment_addr=token_payment_addr.lower(),
        )
        if (
            self._repository.get(
                TicketSale, {"ticket_sale_addr": ticket_sale_addr.lower()}
            )
            is None
        ):
            self._repository.add(ticket_sale)
            self._repository.commit()
        return ticket_sale

    async def _index_ticket(self, ticket_addr):
        contract = self._web3.eth.contract(
            self._web3.to_checksum_address(ticket_addr), abi=get_ticket_abi()
        )
        name = await contract.functions.name().call()
        cap = await contract.functions.CAP().call()
        symbol = await contract.functions.symbol().call()
        total_supply = await contract.functions.totalSupply().call()
        url = await contract.functions.tokenURI(0).call()
        try:
            uri = await self._get_ipfs_data(url)
        except Exception:
            logger.warn(f"Failed to parse IFPS url {url}")
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

    async def _index_promo_created_event(self, log: LogReceipt, pattern: tuple[str]):
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
            self._repository.get(
                PromoCreatedEvent, {"promo_addr": event.promo_addr.lower()}
            )
            is None
        ):
            self._repository.add(event)
            self._repository.commit()
        return event

    async def index_promo(
        self,
        from_block: BlockIdentifier = "earliest",
        to_block: BlockIdentifier = "latest",
    ):
        promo_created_events = self._repository.filter(PromoCreatedEvent, {})
        logger.info(
            f"Indexing promo for {len(promo_created_events)} PromoCreatedEvents from '{from_block}' to '{to_block}' blocks"
        )
        for event in promo_created_events:
            logger.info(f"Indexing promos for {event.promo_addr} collection")
            logs = await self._web3.eth.get_logs(
                filter_params=FilterParams(
                    address=self._web3.to_checksum_address(event.promo_addr),
                    fromBlock=from_block,
                    toBlock=to_block,
                )
            )
            for log in logs:
                topic_name, topic_pattern = self._log_events.get(
                    log["topics"][0].hex(), (None, None)
                )
                if topic_name == "MintPromo":
                    [payment_token_addr] = self.decode_data(
                        topic_pattern, HexBytes(bytes().join(log["topics"][1:]))
                    )
                    try:
                        (
                            token_id,
                            (start_time, end_time, promo_addr, streams, description),
                        ) = self.decode_data(
                            ["uint256", "(uint256,uint256,address,address[],string)"],
                            log["data"],
                        )
                    except InsufficientDataBytes as err:
                        logger.error(
                            f"Error when decoding MintPromo event for {log['transactionHash'].hex()}#{log['blockNumber']} transaction. Reason: {err}"
                        )
                        continue
                    contract = self._web3.eth.contract(
                        self._web3.to_checksum_address(promo_addr), abi=get_promo_abi()
                    )
                    url = await contract.functions.tokenURI(token_id).call()
                    try:
                        uri = await self._get_ipfs_data(url)
                    except Exception:
                        logger.warn(f"Failed to parse IPFS url {url}")
                        uri = {}
                    promo = Promo(
                        owner=event.owner.lower(),
                        payment_token_addr=payment_token_addr.lower(),
                        token_id=token_id,
                        start_time=start_time,
                        end_time=end_time,
                        promo_addr=promo_addr.lower(),
                        description=description,
                        uri=uri,
                    )
                    if (
                        self._repository.get(
                            Promo,
                            {"promo_addr": promo_addr.lower(), "token_id": token_id},
                        )
                    ) is None:
                        self._repository.add(promo)
                        self._repository.commit()
                        logger.info(
                            f"Promo {promo.promo_addr}#{promo.token_id} was saved"
                        )
                    for stream_addr in streams:
                        promo_to_ticket = PromoToTicket(
                            promo_addr=promo_addr.lower(),
                            ticket_addr=stream_addr.lower(),
                            token_id=token_id,
                        )
                        if (
                            self._repository.get(
                                PromoToTicket,
                                {
                                    "promo_addr": promo_addr.lower(),
                                    "ticket_addr": stream_addr.lower(),
                                    "token_id": token_id,
                                },
                            )
                            is None
                        ):
                            self._repository.add(promo_to_ticket)
                            self._repository.commit()
                    return promo

    async def _get_ipfs_data(self, url):
        parsed_url = urlparse(url)
        if parsed_url.scheme == "ipfs":
            result = await asyncio.to_thread(
                requests.get, f"https://ipfs.io/ipfs/{parsed_url.netloc}"
            )
            return result.json()
        else:
            result = await asyncio.to_thread(requests.get, url)
            return result.json()

    async def index_ticket_bought_event(
        self, from_block, to_block: BlockIdentifier = "latest"
    ):
        tickets: List[Ticket] = self._repository.filter(Ticket, {})
        logger.info(
            f"Indexing TicketBoughtEvent for {len(tickets)} tickets from '{from_block}' to '{to_block}'"
        )
        for ticket in tickets:
            logs = await self._web3.eth.get_logs(
                filter_params=FilterParams(
                    address=self._web3.to_checksum_address(ticket.ticket_addr),
                    fromBlock=from_block,
                    toBlock=to_block,
                )
            )
            for log in logs:
                topic_name, pattern = self._log_events.get(
                    log["topics"][0].hex(), (None, None)
                )
                if topic_name is None or pattern is None:
                    continue
                if topic_name == "MintTicket":
                    [buyer] = self.decode_data(
                        pattern, HexBytes(bytes().join(log["topics"][1:]))
                    )
                    [token_id] = self.decode_data(["uint256"], log["data"])
                    event = TicketBoughtEvent(
                        buyer=buyer.lower(),
                        token_id=token_id,
                        ticket_addr=ticket.ticket_addr,
                        transaction_hash=log["transactionHash"].hex(),
                        transaction_index=log["transactionIndex"],
                        block_hash=log["blockHash"].hex(),
                        block_nmb=log["blockNumber"],
                    )
                    if (
                        self._repository.get(
                            TicketBoughtEvent,
                            {
                                "buyer": buyer.lower(),
                                "ticket_addr": ticket.ticket_addr,
                                "token_id": token_id,
                            },
                        )
                        is None
                    ):
                        self._repository.add(event)
                        self._repository.commit()
                    logger.info(
                        f"Indexed TicketBoughtEvent for {ticket.ticket_addr} ticket"
                    )

    async def start_index(
        self,
        from_block: BlockIdentifier = "earliest",
        to_block: BlockIdentifier = "latest",
    ):
        logger.info(
            f"Start indexing from block '{from_block}' to block '{to_block}' for {self._contract.address} factory"
        )
        logs = await self._web3.eth.get_logs(
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
                ticket_sale_event = await self._index_ticket_sale_created_event(
                    log, pattern, topic_bytes
                )
                await self._index_ticket_sale(
                    ticket_sale_event.ticket_sale_addr, ticket_sale_event.owner
                )
                await self._index_ticket(ticket_sale_event.ticket_addr)
                logger.info(f"Indexed ticket {ticket_sale_event.ticket_addr}")
            elif topic_name == "PromotionCreated":
                await self._index_promo_created_event(log, pattern)

        logger.info("Index complete")

    def decode_data(self, pattern, data):
        return self._web3.codec.decode(pattern, data)
