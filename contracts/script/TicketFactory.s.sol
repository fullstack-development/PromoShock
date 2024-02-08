// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";

import {TicketFactory} from "src/TicketFactory.sol";

contract TicketFactoryScript is Script {
    TicketFactory ticketFactoryImplementation;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        ticketFactoryImplementation = new TicketFactory();

        vm.stopBroadcast();

        console.log("------------------ Deployed contracts --------------------");
        console.log("TicketFactory");
        console.log("Implementation   : ", address(ticketFactoryImplementation));
        console.log("------------------ Deployment info -----------------------");
        console.log("Chin id          : ", block.chainid);
        console.log("Deployer         : ", vm.addr(deployerPrivateKey));
    }
}
