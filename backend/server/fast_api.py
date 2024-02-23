from dataclasses import dataclass
import os
from typing import List, Optional
from eth_typing import Address
from web3 import AsyncWeb3, Web3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymemcache.client import Client

from domain.promo import Promo, PromoToTicket
from domain.ticket import Ticket, TicketBoughtEvent, TicketSale, TicketSaleCreatedEvent
from services.indexer import NftIndexer, SqlAlchemyRepository
from config import get_memcache_uri, get_web3_uri
from orm.tables import start_mappers, get_session
from contracts.abi import (
    get_ticket_factory_abi,
    get_ticket_factory_address,
    get_promo_factory_abi,
    get_promo_factory_address,
)


app = FastAPI()
memcache = Client(get_memcache_uri())
web3 = AsyncWeb3(Web3.AsyncHTTPProvider(get_web3_uri()))
start_mappers()

if os.environ.get("ENV") == "DEVELOPMENT":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.post("/index/start")
async def start_index(from_block: int = 37553211, to_block: Optional[int] = None):
    repo = SqlAlchemyRepository(get_session())
    toBlock = "latest" if to_block is None else to_block
    ticket_indexer = NftIndexer(
        web3,
        repo,
        get_ticket_factory_address(),
        get_ticket_factory_abi(),
    )
    promo_indexer = NftIndexer(
        web3,
        repo,
        get_promo_factory_address(),
        get_promo_factory_abi(),
    )
    # TODO: run async
    await ticket_indexer.start_index(from_block=from_block, to_block=toBlock)
    await ticket_indexer.index_ticket_bought_event(from_block, to_block=toBlock)
    await promo_indexer.start_index(from_block=from_block, to_block=toBlock)


@app.post("/index/ticket")
async def index_ticket(from_block: int = 37553211, to_block: Optional[int] = None):
    repo = SqlAlchemyRepository(get_session())
    toBlock = "latest" if to_block is None else to_block
    ticket_indexer = NftIndexer(
        web3,
        repo,
        get_ticket_factory_address(),
        get_ticket_factory_abi(),
    )
    await ticket_indexer.start_index(from_block=from_block, to_block=toBlock)


@app.post("/index/promo")
async def index_promo(from_block: int = 37553211, to_block: Optional[int] = None):
    repo = SqlAlchemyRepository(get_session())
    toBlock = "latest" if to_block is None else to_block
    promo_indexer = NftIndexer(
        web3,
        repo,
        get_promo_factory_address(),
        get_promo_factory_abi(),
    )
    await promo_indexer.start_index(from_block=from_block, to_block=toBlock)


@dataclass(frozen=True)
class Stream:
    owner_address: Address
    sale_address: Address
    ticket_address: Address
    payment_token_address: Address
    name: str
    description: str
    banner: str
    start_date: int
    sale_start_date: int
    sale_end_date: int
    stream_link: str
    streamer_link: str
    price: str
    total_amount: int
    reserved_amount: int
    purchased: bool


@app.get("/ticket")
async def all_tickets(
    owner: Optional[str] = None, buyer: Optional[str] = None, offset=0, limit=25
) -> List[Stream]:
    # TODO: cleanup, fix pyright errors
    def make_stream(ticket_sale: TicketSale):
        ticket_sale_created: Optional[TicketSaleCreatedEvent] = repo.get(
            TicketSaleCreatedEvent, {"ticket_sale_addr": ticket_sale.ticket_sale_addr}
        )
        if ticket_sale_created is None:
            return None
        ticket: Optional[Ticket] = repo.get(
            Ticket, {"ticket_addr": ticket_sale_created.ticket_addr}
        )
        if ticket is None:
            return None
        ticket_bought_event: Optional[TicketBoughtEvent] = repo.get(
            TicketBoughtEvent,
            {
                "ticket_addr": ticket.ticket_addr,
                "buyer": buyer,
            },
        )
        return Stream(
            owner_address=ticket_sale.owner,
            sale_address=ticket_sale.ticket_sale_addr,
            ticket_address=ticket.ticket_addr,
            payment_token_address=ticket_sale.token_payment_addr,
            name=ticket.name,
            description=ticket.token_uri.get("description", ""),
            banner=ticket.token_uri.get("image", ""),
            start_date=ticket.token_uri.get("start_time", 0),
            sale_start_date=ticket_sale.start_time,
            sale_end_date=ticket_sale.end_time,
            stream_link=ticket.token_uri.get("link", ""),
            streamer_link=ticket.token_uri.get("streamer_link", ""),
            price=ticket_sale.price,
            total_amount=ticket.cap,
            reserved_amount=ticket.total_supply,
            purchased=False if ticket_bought_event is None else True,
        )

    filter_params = {}
    if owner:
        filter_params["owner"] = owner

    repo = SqlAlchemyRepository(get_session())
    ticket_sales = repo.filter(TicketSale, filter_params, offset, limit)
    streams = []
    for t in ticket_sales:
        s = make_stream(t)
        if s is not None:
            streams.append(s)

    return streams


@app.get("/ticket/{ticket_addr}")
async def get_stream(ticket_addr: str, buyer: Optional[str] = None) -> Optional[Stream]:
    repo = SqlAlchemyRepository(get_session())
    ticket: Optional[Ticket] = repo.get(Ticket, {"ticket_addr": ticket_addr.lower()})
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    ticket_sale_created: Optional[TicketSaleCreatedEvent] = repo.get(
        TicketSaleCreatedEvent, {"ticket_addr": ticket_addr}
    )
    if ticket_sale_created is None:
        raise HTTPException(status_code=404, detail="Ticket Sale Event not found")
    ticket_sale: Optional[TicketSale] = repo.get(
        TicketSale, {"ticket_sale_addr": ticket_sale_created.ticket_sale_addr}
    )
    if ticket_sale is None:
        raise HTTPException(status_code=404, detail="Ticket Sale not found")
    ticket_bought_event: Optional[TicketBoughtEvent] = repo.get(
        TicketBoughtEvent, {"ticket_addr": ticket_addr, "buyer": buyer}
    )

    return Stream(
        owner_address=ticket_sale.owner,
        sale_address=ticket_sale.ticket_sale_addr,
        ticket_address=ticket.ticket_addr,
        payment_token_address=ticket_sale.token_payment_addr,
        name=ticket.name,
        description=ticket.token_uri.get("description", ""),
        banner=ticket.token_uri.get("image", ""),
        start_date=ticket.token_uri.get("start_time", 0),
        sale_start_date=ticket_sale.start_time,
        sale_end_date=ticket_sale.end_time,
        stream_link=ticket.token_uri.get("link", ""),
        streamer_link=ticket.token_uri.get("streamer_link", ""),
        price=ticket_sale.price,
        total_amount=ticket.cap,
        reserved_amount=ticket.total_supply,
        purchased=False if ticket_bought_event is None else True,
    )


@dataclass(frozen=True)
class PromoInfo:
    owner_address: Address
    promo_addr: Address
    token_id: int
    name: str
    description: str
    cover: str
    link: str
    shopping_link: str
    start_date: int
    end_date: int


@app.get("/promo")
async def all_promos(stream=None, owner=None, offset=0, limit=25):
    repo = SqlAlchemyRepository(get_session())
    filter_params = {}
    if owner:
        filter_params["owner"] = owner
    promos = []
    if stream:
        promo_to_tickets = repo.filter(PromoToTicket, {"ticket_addr": stream})
        promo_addresses = [a.promo_addr for a in promo_to_tickets]
        promos = repo.filter_in(
            Promo,
            Promo.promo_addr,
            promo_addresses,
            filter_params=filter_params,
            offset=offset,
            limit=limit,
        )
    else:
        promos = repo.filter(Promo, filter_params, offset, limit)

    return [
        PromoInfo(
            owner_address=p.owner,
            promo_addr=p.promo_addr,
            token_id=p.token_id,
            name=p.uri.get("name", ""),
            description=p.description,
            cover=p.uri.get("image", ""),
            link=p.uri.get("link", ""),
            shopping_link=p.uri.get("shopping_link", ""),
            start_date=p.start_time,
            end_date=p.end_time,
        )
        for p in promos
    ]


@app.get("/promo/my")
async def my_promos(buyer, offset=0, limit=25):
    repo = SqlAlchemyRepository(get_session())

    ticket_bought_events = repo.filter(TicketBoughtEvent, {"buyer": buyer})
    ticket_addrs = [t.ticket_addr for t in ticket_bought_events]
    promo_to_tickets = repo.filter_in(
        PromoToTicket, PromoToTicket.ticket_addr, ticket_addrs
    )
    promo_addrs = [p.promo_addr for p in promo_to_tickets]
    promos = repo.filter_in(Promo, Promo.promo_addr, promo_addrs, offset, limit)
    return [
        PromoInfo(
            owner_address=p.owner,
            promo_addr=p.promo_addr,
            token_id=p.token_id,
            name=p.uri.get("name", ""),
            description=p.description,
            cover=p.uri.get("image", ""),
            link=p.uri.get("link", ""),
            shopping_link=p.uri.get("shopping_link", ""),
            start_date=p.start_time,
            end_date=p.end_time,
        )
        for p in promos
    ]
