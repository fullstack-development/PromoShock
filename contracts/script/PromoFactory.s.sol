// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";

import {PromoFactory} from "src/PromoFactory.sol";

contract PromoFactoryScript is Script {
    PromoFactory promoFactoryImplementation;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        promoFactoryImplementation = new PromoFactory();

        vm.stopBroadcast();

        console.log("------------------ Deployed contracts --------------------");
        console.log("PromoFactory");
        console.log("Implementation   : ", address(promoFactoryImplementation));
        console.log("------------------ Deployment info -----------------------");
        console.log("Chin id          : ", block.chainid);
        console.log("Deployer         : ", vm.addr(deployerPrivateKey));
    }
}
