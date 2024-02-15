from web3 import Web3
from fastapi import FastAPI
from pymemcache.client import Client

from services.indexer import NftIndexer, SqlAlchemyRepository
from config import get_memcache_uri, get_web3_uri
from orm.tables import start_mappers, get_session
from contracts.abi import get_ticket_factory_abi, get_ticket_factory_address


app = FastAPI()
memcache = Client(get_memcache_uri())
web3 = Web3(Web3.HTTPProvider(get_web3_uri()))
start_mappers()


@app.post("/index/ticket_sale")
def index_ticket_sale():
    session = get_session()
    indexer = NftIndexer(
        web3,
        SqlAlchemyRepository(session),
        get_ticket_factory_address(),
        get_ticket_factory_abi(),
    )

    indexer.start_index(from_block="finalized")

    return []
