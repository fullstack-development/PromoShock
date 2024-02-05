from datetime import datetime
import pytest

from domain.sales import Sale, PreSale, InvalidPreSale, NoTicketsError, start_sale
from domain.models import Viewer
from domain.ticket import Ticket

today = datetime.now()


def from_ticket(ticket_id):
    return Ticket(
        name=ticket_id, symbol="", cap=0, base_token_uri="", contract_uri="", owners=[]
    )


def test_should_close_pre_sale():
    pre_sale = PreSale(
        "sale-id", "stream-id", started_at=today, payment_token="payment-token"
    )
    pre_sale.close()

    assert pre_sale.is_valid == False


def test_should_issue_tickets_for_pre_sale():
    pre_sale = PreSale(
        "sale-id", "stream-id", started_at=today, payment_token="payment-token"
    )
    tickets = [from_ticket("ticket-1"), from_ticket("ticket-2"), from_ticket("ticket-3")]
    pre_sale.register_tickets(tickets)

    assert pre_sale.total_tickets == 3


def test_should_not_start_closed_pre_sale():
    pre_sale = PreSale(
        "sale-id", "stream-id", started_at=today, payment_token="payment-token"
    )
    pre_sale.close()

    with pytest.raises(InvalidPreSale, match="Can't start invalid pre-sale"):
        start_sale(pre_sale, datetime.now())


def test_should_not_start_pre_sale_with_no_tickets():
    pre_sale = PreSale(
        "sale-id", "stream-id", started_at=today, payment_token="payment-token"
    )

    with pytest.raises(NoTicketsError, match="Can't start a sale without tickets"):
        start_sale(pre_sale, datetime.now())


def test_pre_sale_should_start():
    pre_sale = PreSale(
        "sale-id", "stream-id", started_at=today, payment_token="payment-token"
    )
    tickets = [from_ticket("ticket-1"), from_ticket("ticket-2"), from_ticket("ticket-3")]
    pre_sale.register_tickets(tickets)
    sale: Sale = start_sale(pre_sale, datetime.now())

    assert sale.is_active == True
    assert sale.available_tickets == 3


def test_should_register_viewer_purchase_during_sale():
    pre_sale = PreSale(
        "sale-id", "stream-id", started_at=today, payment_token="payment-token"
    )
    viewer = Viewer("viewer-id")
    tickets = [from_ticket("ticket-1"), from_ticket("ticket-2"), from_ticket("ticket-3")]
    pre_sale.register_tickets(tickets)
    sale: Sale = start_sale(pre_sale, datetime.now())

    sale.register_viewer_purchase(viewer)

    assert sale.total_purchase == 1
    assert sale.available_tickets == 2


def test_should_register_refund_after_purchase():
    pre_sale = PreSale(
        "sale-id", "stream-id", started_at=today, payment_token="payment-token"
    )
    viewer = Viewer("viewer-id")
    tickets = [from_ticket("ticket-1"), from_ticket("ticket-2"), from_ticket("ticket-3")]
    pre_sale.register_tickets(tickets)
    sale: Sale = start_sale(pre_sale, datetime.now())

    sale.register_viewer_purchase(viewer)
    sale.register_viewer_refund(viewer)

    assert sale.total_purchase == 0
    assert sale.available_tickets == 3
