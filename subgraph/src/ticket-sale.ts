import {
    StreamCreated as StreamCreatedEvent,
    Sold as SoldEvent,
} from '../generated/templates/TicketSale/TicketSale';
import { TicketMetadata as TicketMetadataTemplate } from '../generated/templates';
import { Sold, Ticket, Stream } from '../generated/schema';
import {
    json,
    Bytes,
    dataSource,
    DataSourceContext,
    BigInt,
    log,
} from '@graphprotocol/graph-ts';
import { TicketMetadata } from '../generated/schema';

const TICKET_METADATA_ID_KEY = 'ticketId';

export function handleStreamCreated(event: StreamCreatedEvent): void {
    let entity = new Stream(event.params.ticket.toHexString());

    entity.owner = event.params.streamer;
    entity.saleAddress = event.params.ticketSale;
    entity.ticketAddress = event.params.ticket;
    entity.paymentTokenAddress = event.params.sale.paymentToken;
    entity.price = event.params.sale.price;
    entity.saleStartDate = event.params.sale.startTime;
    entity.saleEndDate = event.params.sale.endTime;
    entity.totalAmount = event.params.ticketParams.cap;
    entity.reservedAmount = 0;
    entity.purchased = false;

    let baseUri = event.params.ticketParams.baseUri;

    let ticketMetadataId = entity.id;
    let context = new DataSourceContext();
    context.setBytes(TICKET_METADATA_ID_KEY, Bytes.fromUTF8(ticketMetadataId));

    if (baseUri.length == 80) {
        let hash = baseUri.substr(21);
        TicketMetadataTemplate.createWithContext(hash, context);
    }

    entity.metadata = ticketMetadataId;
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;
    entity.save();
}

export function handleTicketMetadata(content: Bytes): void {
    let ctx = dataSource.context();
    let id = ctx.getBytes(TICKET_METADATA_ID_KEY);

    let ticketMetadata = new TicketMetadata(id.toString());
    const value = json.fromBytes(content).toObject();
    if (value) {
        const name = value.get('name');
        const description = value.get('description');
        const start_time = value.get('start_time');
        const stream_link = value.get('stream_link');
        const streamer_link = value.get('streamer_link');
        const image = value.get('image');
        const banner = value.get('banner');
        const external_link = value.get('external_link');

        if (
            name &&
            description &&
            start_time &&
            stream_link &&
            streamer_link &&
            image &&
            banner &&
            external_link
        ) {
            ticketMetadata.name = name.toString();
            ticketMetadata.description = description.toString();
            ticketMetadata.start_time = start_time.toBigInt();
            ticketMetadata.stream_link = stream_link.toString();
            ticketMetadata.streamer_link = streamer_link.toString();
            ticketMetadata.image = image.toString();
            ticketMetadata.banner = banner.toString();
            ticketMetadata.external_link = external_link.toString();
        } else {
            ticketMetadata.name = '';
            ticketMetadata.description = '';
            ticketMetadata.stream_link = '';
            ticketMetadata.start_time = new BigInt(0);
            ticketMetadata.streamer_link = '';
            ticketMetadata.image = '';
            ticketMetadata.banner = '';
            ticketMetadata.external_link = '';
        }

        ticketMetadata.save();
    }
}

export function handleSold(event: SoldEvent): void {
    let entity = new Sold(
        event.transaction.hash
            .toHexString()
            .concat(event.logIndex.toHexString()),
    );

    let ticket = Ticket.load(event.params.ticket.toHexString());

    if (ticket) {
        ticket.sold = entity.id;
        ticket.save();
        entity.ticketMetadata = ticket.id;
    } else {
        log.warning('SOLD: Ticket not exist', [
            event.params.ticket.toHexString(),
        ]);
    }

    if (ticket) {
        let stream = Stream.load(ticket.address.toHexString());

        if (stream) {
            let totalAmount = stream.totalAmount;

            let reservedAmount = stream.reservedAmount + 1;
            stream.reservedAmount = reservedAmount;

            if (stream.reservedAmount >= totalAmount) {
                stream.purchased = true;
            }
            stream.save();
        } else {
            log.warning('SOLD: Stream not exist', [
                event.params.ticket.toHexString(),
            ]);
        }
    }

    entity.buyer = event.params.buyer;
    entity.tokenId = event.params.tokenId;
    entity.price = event.params.price;
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;
    entity.save();
}
