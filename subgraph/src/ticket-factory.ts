import { TicketSaleCreated as TicketSaleCreatedEvent } from '../generated/TicketFactory/TicketFactory';
import {
    TicketSale as TicketSaleTemplate,
    Ticket as TicketTemplate,
} from '../generated/templates';
import { TicketSaleCreated, Ticket } from '../generated/schema';
import { log } from '@graphprotocol/graph-ts';

export function handleTicketSaleCreated(event: TicketSaleCreatedEvent): void {
    let entity = new TicketSaleCreated(
        event.transaction.hash
            .toHexString()
            .concat(event.logIndex.toHexString()),
    );

    entity.creator = event.params.creator;
    entity.ticketSaleAddr = event.params.ticketSaleAddr;
    entity.ticketAddr = event.params.ticketAddr;
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;

    let ticket = Ticket.load(entity.ticketAddr.toHexString());
    let promos = new Array<string>();

    if (!ticket) {
        let ticketAddr = entity.ticketAddr.toHexString();
        ticket = new Ticket(ticketAddr);
        ticket.address = entity.ticketAddr;
        ticket.sold = '';
        ticket.promos = promos;
        ticket.save();
    } else {
        log.warning('SALE_CREATED: Ticket already exist', [ticket.id]);
    }

    entity.save();

    TicketSaleTemplate.create(event.params.ticketSaleAddr);
    TicketTemplate.create(event.params.ticketAddr);
}
