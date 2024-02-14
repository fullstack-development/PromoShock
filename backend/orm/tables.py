from sqlalchemy import Column, Integer, MetaData, String, Table, create_engine
from sqlalchemy.orm import registry, sessionmaker
from config import get_postgres_uri

from domain.ticket import TicketSale

metadata = MetaData()
mapper = registry()
engine = create_engine(get_postgres_uri())
get_session = sessionmaker(bind=engine)

ticket_sale_table = Table(
    "ticket_sale",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("transaction_hash", String(255), ),
    Column("transaction_id", Integer, ),
    Column("block_nmb", Integer),
    Column("block_hash", String(255)),
    Column("owner", String(255)),
    Column("ticket_sale_addr", String(255), unique=True),
    Column("ticket_addr", String(255), unique=True),
)


def start_mappers():
    ticket_sale = mapper.map_imperatively(TicketSale, ticket_sale_table)
    metadata.create_all(engine)
