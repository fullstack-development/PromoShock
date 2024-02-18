from web3 import Web3
from fastapi import FastAPI
from pymemcache.client import Client

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
