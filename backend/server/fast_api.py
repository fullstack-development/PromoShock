from dataclasses import dataclass
from typing import List, Optional
from eth_typing import Address
from web3 import Web3
from fastapi import FastAPI, HTTPException
from pymemcache.client import Client

from domain.promo import Promo, PromoToTicket
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
    sale_address: Address
    ticket_addr: Address
    name: str
    description: str
    banner: str
    sale_start_date: int
    sale_end_date: int
    link: str
    streamer_link: str
    price: str
    total_amount: int
    reserved_amount: int


@app.get("/ticket")
async def all_tickets(owner = None, offset=0, limit=25) -> List[Stream]:
    # TODO: cleanup, fix pyright errors
    def make_stream(ticket: Ticket):
        ticket_sale_created = repo.get(
            TicketSaleCreatedEvent, {"ticket_addr": ticket.ticket_addr}
        )
        if ticket_sale_created is None:
            return None
        filter_params = {"ticket_sale_addr": ticket_sale_created.ticket_sale_addr}
        if owner:
            filter_params["owner"] = owner
        ticket_sale = repo.get(
            TicketSale, filter_params
        )
        if ticket_sale is None:
            return None
        return Stream(
            owner_address=ticket_sale.owner,
            sale_address=ticket_sale.ticket_sale_addr,
            ticket_addr=ticket.ticket_addr,
            name=ticket.name,
            description=ticket.token_uri.get("description", ""),
            banner=ticket.token_uri.get("image", ""),
            sale_start_date=ticket_sale.start_time,
            sale_end_date=ticket_sale.end_time,
            link=ticket.token_uri.get("link", ""),
            streamer_link=ticket.token_uri.get("streamer_link", ""),
            price=ticket_sale.price,
            total_amount=ticket.cap,
            reserved_amount=ticket.total_supply,
        )

    repo = SqlAlchemyRepository(get_session())
    tickets = repo.filter(Ticket, {}, offset, limit)
    streams = []
    for t in tickets:
        s = make_stream(t)
        if s is not None:
            streams.append(s)

    return streams


@app.get("/ticket/{ticket_addr}")
async def get_stream(ticket_addr: str) -> Optional[Stream]:
    repo = SqlAlchemyRepository(get_session())
    ticket = repo.get(Ticket, {"ticket_addr": ticket_addr})
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    ticket_sale_created = repo.get(TicketSaleCreatedEvent, {"ticket_addr": ticket_addr})
    if ticket_sale_created is None:
        raise HTTPException(status_code=404, detail="Ticket Sale Event not found")
    ticket_sale = repo.get(
        TicketSale, {"ticket_sale_addr": ticket_sale_created.ticket_sale_addr}
    )
    if ticket_sale is None:
        raise HTTPException(status_code=404, detail="Ticket Sale not found")

    return Stream(
        owner_address=ticket_sale.owner,
        sale_address=ticket_sale.ticket_sale_addr,
        ticket_addr=ticket.ticket_addr,
        name=ticket.name,
        description=ticket.token_uri.get("description", ""),
        banner=ticket.token_uri.get("image", ""),
        sale_start_date=ticket_sale.start_time,
        sale_end_date=ticket_sale.end_time,
        link=ticket.token_uri.get("link", ""),
        streamer_link=ticket.token_uri.get("streamer_link", ""),
        price=ticket_sale.price,
        total_amount=ticket.cap,
        reserved_amount=ticket.total_supply,
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
async def all_promos(stream = None, owner = None, offset=0, limit=25):
    repo = SqlAlchemyRepository(get_session())
    filter_params = {}
    if owner:
        filter_params["owner"] = owner
    promos = []
    if stream:
        promo_to_tickets = repo.filter(PromoToTicket, {"ticket_addr": stream})
        promo_addresses = [a.promo_addr for a in promo_to_tickets]
        promos = repo.filter_in(Promo, Promo.promo_addr, promo_addresses, filter_params=filter_params, offset=offset, limit=limit)
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
