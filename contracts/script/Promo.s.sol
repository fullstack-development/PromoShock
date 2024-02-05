// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";

import {TransparentUpgradeableProxy} from
    "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import {Promo} from "src/Promo.sol";

contract PromoScript is Script {
    Promo promoImplementation;
    TransparentUpgradeableProxy promoProxy;

    function run(address proxyAdmin, address promoFactory, string calldata contractUri) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        bytes memory promoData =
            abi.encodeWithSignature("initialize(address,string)", promoFactory, contractUri);

        vm.startBroadcast(deployerPrivateKey);

        promoImplementation = new Promo();

        promoProxy = new TransparentUpgradeableProxy(
            address(promoImplementation), address(proxyAdmin), promoData
        );

        vm.stopBroadcast();

        console.log("------------------ Deployed contracts --------------------");
        console.log("Promo");
        console.log("Implementation   : ", address(promoImplementation));
        console.log("Proxy            : ", address(promoProxy));
        console.log("ProxyAdmin       : ", proxyAdmin);
        console.log("------------------ Deployment info -----------------------");
        console.log("Chin id          : ", block.chainid);
        console.log("Deployer         : ", vm.addr(deployerPrivateKey));
    }
}
