import json
import os
import aiofiles


def get_ticket_abi():
    with open(os.path.abspath("../contracts/abi/TicketFactory.sol/TicketFactory.json"), "r") as f:
        c = f.read()
        return json.loads(c)["abi"]
