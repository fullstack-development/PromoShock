import json
import os

from eth_typing import Address


def get_ticket_factory_address() -> Address:
    addr = os.environ.get("TICKET_FACTORY_ADDR", None)
    if addr is None:
        raise Exception("TICKET_FACTORY_ADDR is not set")
    return addr


def get_ticket_factory_abi():
    with open(
        os.path.abspath("../contracts/abi/TicketFactory.sol/TicketFactory.json"), "r"
    ) as f:
        c = f.read()
        return json.loads(c)["abi"]


def get_promo_factory_address() -> Address:
    addr = os.environ.get("PROMO_FACTORY_ADDR", None)
    if addr is None:
        raise Exception("PROMO_FACTORY_ADDR is not set")
    return addr


def get_promo_factory_abi():
    with open(
        os.path.abspath("../contracts/abi/PromoFactory.sol/PromoFactory.json")
    ) as f:
        c = f.read()
        return json.loads(c)["abi"]


def get_promo_abi():
    with open(os.path.abspath("../contracts/abi/Promo.sol/Promo.json")) as f:
        c = f.read()
        return json.loads(c)["abi"]


def get_ticket_sale_abi():
    with open(
        os.path.abspath("../contracts/abi/TicketSale.sol/TicketSale.json"), "r"
    ) as f:
        c = f.read()
        return json.loads(c)["abi"]


def get_ticket_abi():
    with open(os.path.abspath("../contracts/abi/Ticket.sol/Ticket.json"), "r") as f:
        c = f.read()
        return json.loads(c)["abi"]
