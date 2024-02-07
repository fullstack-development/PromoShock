from contracts.abi import get_ticket_abi
from fastapi import FastAPI
from pymemcache.client import Client
from services.indexer import BNBWeb3Client, MemcacheNftRepository, NftIndexer

app = FastAPI()
memcache_client = Client("localhost:3000")


@app.post("/index/ticket/{ticket_address}")
async def index_ticket_nft(ticket_address: str):
    web3_client = BNBWeb3Client("https://data-seed-prebsc-1-s1.binance.org:8545/")
    repo = MemcacheNftRepository(memcache_client)
    ticket_abi = get_ticket_abi()
    indexer = NftIndexer(web3_client, repo, ticket_address, ticket_abi)
    indexed_nft = indexer.index_nft()
    print(f"Indexed NFT: {indexed_nft}")
    return {}


@app.post("/index/collection/{collection_address}")
async def index_ticket_collection(collection_address: str):
    return {}


@app.post("/index/promo/{promo_address}")
async def index_promo_nft(promo_address: str):
    return {}
