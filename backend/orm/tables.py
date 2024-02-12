from sqlalchemy import Column, Integer, MetaData, String, registry, Table

from backend.domain.ticket import TicketSale

metadata = MetaData()
mapper = registry()

ticket_sale_table = Table(
    'ticket_sale', metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('transaction_hash', String(255)),
    Column('streamer', String(255)),
    Column('ticket_sale_addr', String(255)),
    Column('ticket_addr', String(255))
)

def start_mappers():
    mapper.map_imperatively(TicketSale, ticket_sale_table)
