import { PromoCreated as PromoCreatedEvent } from '../generated/PromoFactory/PromoFactory';
import { Ticket, Promo, PromoMetadata } from '../generated/schema';
import { PromoMetadata as PromoMetadataTemplate } from '../generated/templates';
import {
    json,
    Bytes,
    dataSource,
    DataSourceContext,
    BigInt,
    log,
} from '@graphprotocol/graph-ts';

const PROMO_METADATA_ID_KEY = 'promoId';

export function handlePromotionCreated(event: PromoCreatedEvent): void {
    let entity = new Promo(
        event.params.marketer
            .toHexString()
            .concat('-')
            .concat(event.params.tokenId.toString()),
    );

    entity.marketer = event.params.marketer;
    entity.tokenId = event.params.tokenId;

    let ticketAddressStr = '';
    let tickets = new Array<Bytes>();

    // Streams in Promo
    for (let i = 0; i < event.params.promotion.streams.length; i++) {
        let ticketAddr = event.params.promotion.streams[i];

        let ticket = Ticket.load(ticketAddr.toHexString());
        
        if (!ticket) {
            ticket = new Ticket(ticketAddr.toHexString());
            ticket.address = ticketAddr;
            ticket.sold = '';
            
            let promos = new Array<string>()
            promos.push(entity.id);
            ticket.promos = promos;

            ticket.save();
        } else {
            let promos = ticket.promos;
            promos.push(entity.id);

            ticket.promos = promos;
            ticket.save();
        }

        tickets.push(ticketAddr);

        ticketAddressStr = ticketAddressStr
            .concat(ticketAddr.toHexString())
            .concat(':');
    }

    entity.ticketAddressStr = ticketAddressStr.toString();
    entity.tickets = tickets;
    entity.tokenAddress = event.params.promotion.promoAddr;
    entity.tokenUri = event.params.uri;

    entity.metadata = entity.id;

    entity.startDate = event.params.promotion.startTime;
    entity.endDate = event.params.promotion.endTime;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.save();

    let context = new DataSourceContext();
    context.setBytes(PROMO_METADATA_ID_KEY, Bytes.fromUTF8(entity.id));

    let promo = Promo.loadInBlock(entity.id);
    if (!promo) {
        throw new Error('Promo is not exist');
    }

    // ipfs
    if (event.params.uri.length == 80) {
        let hash = event.params.uri.substr(21);
        PromoMetadataTemplate.createWithContext(hash, context);
    }
    //
}

export function handlePromoMetadata(content: Bytes): void {
    let ctx = dataSource.context();
    let id = ctx.getBytes(PROMO_METADATA_ID_KEY);

    let promoMetadata = new PromoMetadata(id.toString());
    const value = json.fromBytes(content).toObject();

    if (value) {
        const name = value.get('name');
        const description = value.get('description');
        const cover = value.get('image');
        const shoppingLink = value.get('shopping_link');

        if (name && description && cover && shoppingLink) {
            promoMetadata.name = name.toString();
            promoMetadata.description = description.toString();
            promoMetadata.cover = cover.toString();
            promoMetadata.shoppingLink = shoppingLink.toString();
        }

        promoMetadata.save();
    }
}
