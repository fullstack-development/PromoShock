// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";

import {Ticket} from "src/Ticket.sol";

contract TicketScript is Script {
    Ticket ticketImplementation;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        ticketImplementation = new Ticket();

        vm.stopBroadcast();

        console.log("------------------ Deployed contracts --------------------");
        console.log("Ticket");
        console.log("Implementation   : ", address(ticketImplementation));
        console.log("------------------ Deployment info -----------------------");
        console.log("Chin id          : ", block.chainid);
        console.log("Deployer         : ", vm.addr(deployerPrivateKey));
    }
}
