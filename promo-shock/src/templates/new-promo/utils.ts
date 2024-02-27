import type { Address } from "viem";

import { readTicketSupportsInterface } from "@generated/wagmi";

import { web3Config } from "@promo-shock/configs/web3";
import { TICKET_INTERFACE_BYTES } from "@promo-shock/shared/constants";

const assertIsTickets = async (addresses: Address[]) => {
  const flags = await Promise.all(
    addresses.map(async (address) => {
      const supportsInterface = readTicketSupportsInterface(web3Config, {
        address,
        args: [TICKET_INTERFACE_BYTES],
      });

      return supportsInterface;
    }),
  );
  console.log(flags);

  if (!flags.every((flag) => flag)) {
    // TODO :: specify error
    throw new Error();
  }
};

export { assertIsTickets };
