from datetime import date
from typing import List, Set

from domain.models import Ticket, Viewer


class NoTicketsError(Exception):
    pass


class InvalidPreSale(Exception):
    pass


class AlreadyRefuned(Exception):
    pass


class NoTicketsLeftForPurhcase(Exception):
    pass


class ViewerAlreadyPurchased(Exception):
    pass


class PreSale:
    def __init__(
        self,
        pre_sale_id: str,
        stream_id: str,
    ) -> None:
        self._id = pre_sale_id
        self._stream_id = stream_id
        self._tickets: List[Ticket] = []
        self._is_closed = False

    @property
    def is_valid(self):
        return self._is_closed is not True

    @property
    def total_tickets(self):
        return len(self._tickets)

    def close(self):
        if self._is_closed is not True:
            self._is_closed = True

    def register_tickets(self, tickets):
        for ticket in tickets:
            self._tickets.append(ticket)


def start_sale(pre_sale: PreSale, started_at: date):
    if pre_sale.is_valid is not True:
        raise InvalidPreSale("Can't start invalid pre-sale")

    if pre_sale.total_tickets <= 0:
        raise NoTicketsError("Can't start a sale without tickets")
    return Sale(pre_sale._id, pre_sale._stream_id, pre_sale._tickets, started_at)


class Sale:
    def __init__(
        self, sale_id: str, stream_id: str, tickets: List[Ticket], started_at: date
    ) -> None:
        self._id = sale_id
        self._stream_id = stream_id
        self._tickets = tickets
        self._is_closed = False
        self._purchased_viewers: Set[Viewer] = set()
        self._started_at = started_at

    @property
    def is_active(self):
        return self._is_closed is not True and len(self._tickets) > 0

    @property
    def available_tickets(self):
        return self.total_tickets - self.total_purchase

    @property
    def total_tickets(self):
        return len(self._tickets)

    @property
    def total_purchase(self):
        return len(self._purchased_viewers)

    def register_viewer_purchase(self, viewer: Viewer):
        if self.available_tickets <= 0:
            raise NoTicketsLeftForPurhcase

        if viewer in self._purchased_viewers:
            raise ViewerAlreadyPurchased

        self._purchased_viewers.add(viewer)

    def register_viewer_refund(self, viewer: Viewer):
        if viewer not in self._purchased_viewers:
            raise AlreadyRefuned
        self._purchased_viewers.remove(viewer)


class PostSale:
    pass
