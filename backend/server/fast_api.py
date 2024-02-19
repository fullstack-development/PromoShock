from dataclasses import dataclass
from datetime import date
from typing import List
from eth_typing import Address
from web3 import Web3
from fastapi import FastAPI
from pymemcache.client import Client

from domain.promo import Promo
from domain.ticket import Ticket, TicketSale, TicketSaleCreatedEvent
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
web3 = Web3(Web3.HTTPProvider(get_web3_uri()))
start_mappers()


@app.post("/index/start")
async def start_index():
    repo = SqlAlchemyRepository(get_session())
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
    await ticket_indexer.start_index(from_block=37553211)
    await promo_indexer.start_index(from_block=37553211)


@dataclass(frozen=True)
class Stream:
    owner_address: Address
    name: str
    description: str
    banner: str
    stream_start_date: int
    stream_end_date: int
    link: str
    streamer_link: str
    price: str
    total_amount: int
    reserved_amount: int


@app.get("/ticket")
async def all_tickets(offset=0, limit=25) -> List[Stream]:
    # TODO: cleanup, fix pyright errors
    def make_stream(ticket):
        ticket_sale_created = repo.get(
            TicketSaleCreatedEvent, {"ticket_addr": ticket.ticket_addr}
        )
        ticket_sale = repo.get(
            TicketSale, {"ticket_sale_addr": ticket_sale_created.ticket_sale_addr}
        )
        return Stream(
            owner_address=ticket_sale.owner,
            name=ticket.name,
            description=ticket.token_uri.get("description", ""),
            banner=ticket.token_uri.get("image", ""),
            stream_start_date=ticket_sale.start_time,
            stream_end_date=ticket_sale.end_time,
            link=ticket.token_uri.get("link", ""),
            streamer_link=ticket.token_uri.get("streamer_link", ""),
            price=ticket_sale.price,
            total_amount=ticket.cap,
            reserved_amount=ticket.total_supply,
        )

    repo = SqlAlchemyRepository(get_session())
    tickets = repo.filter(Ticket, {}, offset, limit)

    return [make_stream(ticket) for ticket in tickets]


@dataclass(frozen=True)
class PromoInfo:
    owner_address: Address
    name: str
    description: str
    cover: str
    link: str
    start_date: int
    end_date: int


@app.get("/promo")
async def all_promos(offset=0, limit=25):
    repo = SqlAlchemyRepository(get_session())
    promos = repo.filter(Promo, {})

    return [
        PromoInfo(
            p.owner,
            p.uri.get("name", ""),
            p.description,
            p.uri.get("image", ""),
            p.uri.get("link", ""),
            p.start_time,
            p.end_time,
        )
        for p in promos
    ]
