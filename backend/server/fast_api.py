from fastapi import FastAPI

app = FastAPI()


@app.post("/index/ticket/{ticket_address}")
async def index_ticket_nft(ticket_address: str):
    return {}


@app.post("/index/collection/{collection_address}")
async def index_ticket_collection(collection_address: str):
    return {}


@app.post("/index/promo/{promo_address}")
async def index_promo_nft(promo_address: str):
    return {}
