// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";

import {Promo} from "src/Promo.sol";

contract PromoScript is Script {
    Promo promoImplementation;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        promoImplementation = new Promo();

        vm.stopBroadcast();

        console.log("------------------ Deployed contracts --------------------");
        console.log("Promo");
        console.log("Implementation   : ", address(promoImplementation));
        console.log("------------------ Deployment info -----------------------");
        console.log("Chin id          : ", block.chainid);
        console.log("Deployer         : ", vm.addr(deployerPrivateKey));
    }
}
