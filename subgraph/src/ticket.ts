import { MintTicket as MintTicketEvent } from '../generated/templates/Ticket/Ticket';
import { MintTicket } from '../generated/schema';

export function handleMintTicket(event: MintTicketEvent): void {
    let entity = new MintTicket(
        event.transaction.hash
            .toHexString()
            .concat(event.logIndex.toHexString()),
    );
    entity.owner = event.params.owner;
    entity.tokenId = event.params.tokenId;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}
