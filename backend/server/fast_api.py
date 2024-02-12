from web3 import Web3
from contracts.abi import get_ticket_factory_abi, get_ticket_factory_address
from fastapi import FastAPI
from pymemcache.client import Client

from services.indexer import MemcacheNftRepository, NftIndexer


app = FastAPI()
memcache_client = Client("localhost:3000")
web3 = Web3(Web3.HTTPProvider("https://data-seed-prebsc-2-s2.bnbchain.org:8545"))


@app.post("/index/ticket_sale")
async def index_ticket_sale():
    contract_address = get_ticket_factory_address()
    contract_abi = get_ticket_factory_abi()
    repo = MemcacheNftRepository(memcache_client)
    indexer = NftIndexer(web3, repo, contract_address, contract_abi)
    indexer.index_ticket_sale()

    return []


@app.post("/index/collection/{collection_address}")
async def index_ticket_collection(collection_address: str):
    return {}

