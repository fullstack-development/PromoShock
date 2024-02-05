// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";

import {TicketSale} from "src/TicketSale.sol";

contract TicketSaleScript is Script {
    TicketSale ticketSaleImplementation;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        ticketSaleImplementation = new TicketSale();

        vm.stopBroadcast();

        console.log("------------------ Deployed contracts --------------------");
        console.log("TicketSale");
        console.log("Implementation   : ", address(ticketSaleImplementation));
        console.log("------------------ Deployment info -----------------------");
        console.log("Chin id          : ", block.chainid);
        console.log("Deployer         : ", vm.addr(deployerPrivateKey));
    }
}
