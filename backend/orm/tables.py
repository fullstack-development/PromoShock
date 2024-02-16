from sqlalchemy import Column, Integer, MetaData, String, Table, create_engine
from sqlalchemy.orm import registry, sessionmaker
from domain.promo import PromoCreatedEvent
from config import get_postgres_uri
from domain.ticket import Ticket, TicketSale, TicketSaleCreatedEvent


metadata = MetaData()
mapper = registry()
engine = create_engine(get_postgres_uri())
get_session = sessionmaker(bind=engine)

ticket_sale_created_table = Table(
    "ticket_sale_created_event",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column(
        "transaction_hash",
        String(255),
    ),
    Column(
        "transaction_id",
        Integer,
    ),
    Column("block_nmb", Integer),
    Column("block_hash", String(255)),
    Column("owner", String(255)),
    Column("ticket_sale_addr", String(255), unique=True),
    Column("ticket_addr", String(255), unique=True),
)

ticket_sale_table = Table(
    "ticket_sale",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("ticket_sale_addr", String(255), unique=True),
    Column("start_time", Integer),
    Column("end_time", Integer),
    Column("price", String(255)),
    Column("owner", String(255)),
)

ticket_table = Table(
    "ticket",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("ticket_addr", String(255), unique=True),
    Column("name", String(255)),
    Column("symbol", String(255)),
    Column("token_uri", String(255)),
    Column("cap", Integer),
)

promo_created_event_table = Table(
    "promo_created_event",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("start_time", Integer),
    Column("end_time", Integer),
    Column("promo_addr", String(255), unique=True),
    Column("streams", String(1024)),
    Column("description", String(512)),
    Column("transaction_hash", String(255)),
    Column("transaction_index", Integer),
    Column("block_hash", String(255)),
    Column("block_nmb", Integer),
)


def start_mappers():
    ticket_sale_created = mapper.map_imperatively(
        TicketSaleCreatedEvent, ticket_sale_created_table
    )
    ticket_sale = mapper.map_imperatively(TicketSale, ticket_sale_table)
    ticket = mapper.map_imperatively(Ticket, ticket_table)
    promo_created_event = mapper.map_imperatively(
        PromoCreatedEvent, promo_created_event_table
    )
    metadata.create_all(engine)
