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
async def index_ticket_sale():
    contract_address = get_ticket_factory_address()
    contract_abi = get_ticket_factory_abi()
    session = get_session()
    repo = SqlAlchemyRepository(session)
    indexer = NftIndexer(web3, repo, contract_address, contract_abi)
    indexer.start_index(from_block=37552774)

    return []
