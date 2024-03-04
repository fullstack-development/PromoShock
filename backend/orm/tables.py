from sqlalchemy import (
    Column,
    Integer,
    MetaData,
    String,
    Table,
    create_engine,
)
from sqlalchemy.orm import registry, sessionmaker
from sqlalchemy.types import JSON
from domain.promo import Promo, PromoCreatedEvent, PromoToTicket
from config import get_postgres_uri
from domain.ticket import Ticket, TicketBoughtEvent, TicketSale, TicketSaleCreatedEvent


metadata = MetaData()
mapper = registry()
engine = create_engine(get_postgres_uri(), pool_size=10, max_overflow=20)
get_session = sessionmaker(bind=engine)

ticket_sale_created_table = Table(
    "ticket_sale_created_event",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column(
        "transaction_hash",
        String(256),
    ),
    Column(
        "transaction_id",
        Integer,
    ),
    Column("block_nmb", Integer),
    Column("block_hash", String(256)),
    Column("owner", String(256)),
    Column("ticket_sale_addr", String(256), unique=True),
    Column("ticket_addr", String(256), unique=True),
)

ticket_sale_table = Table(
    "ticket_sale",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("ticket_sale_addr", String(256), unique=True),
    Column("token_payment_addr", String(256)),
    Column("start_time", Integer),
    Column("end_time", Integer),
    Column("price", String(256)),
    Column("owner", String(256)),
)

ticket_bought_event_table = Table(
    "ticket_bought_event",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("buyer", String(256)),
    Column("ticket_addr", String(256)),
    Column("token_id", Integer),
    Column("transaction_hash", String(256)),
    Column("transaction_id", Integer),
    Column("block_hash", String(256)),
    Column("block_nmb", Integer),
)

ticket_table = Table(
    "ticket",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("ticket_addr", String(256), unique=True),
    Column("name", String(256)),
    Column("symbol", String(256)),
    Column("token_uri", JSON),
    Column("cap", Integer),
    Column("total_supply", Integer),
)

promo_created_event_table = Table(
    "promo_created_event",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("start_time", Integer),
    Column("owner", String(256)),
    Column("end_time", Integer),
    Column("promo_addr", String(256), unique=True),
    Column("streams", String(1024)),
    Column("description", String(512)),
    Column("transaction_hash", String(256)),
    Column("transaction_index", Integer),
    Column("block_hash", String(256)),
    Column("block_nmb", Integer),
)

promo_table = Table(
    "promo",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("owner", String(256)),
    Column("payment_token_addr", String(256)),
    Column("token_id", Integer),
    Column("start_time", Integer),
    Column("end_time", Integer),
    Column("promo_addr", String(256)),
    Column("description", String(512)),
    Column("uri", JSON),
)

promo_to_ticket_table = Table(
    "promo_to_ticket",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("promo_addr", String(256)),
    Column("ticket_addr", String(256)),
    Column("token_id", Integer),
)


def start_mappers():
    mapper.map_imperatively(TicketSaleCreatedEvent, ticket_sale_created_table)
    mapper.map_imperatively(TicketSale, ticket_sale_table)
    mapper.map_imperatively(Ticket, ticket_table)
    mapper.map_imperatively(PromoCreatedEvent, promo_created_event_table)
    mapper.map_imperatively(
        Promo,
        promo_table,
    )
    mapper.map_imperatively(PromoToTicket, promo_to_ticket_table)
    mapper.map_imperatively(TicketBoughtEvent, ticket_bought_event_table)
    metadata.create_all(engine)
