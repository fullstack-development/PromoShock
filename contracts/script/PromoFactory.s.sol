// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";

import {TransparentUpgradeableProxy} from
    "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import {PromoFactory} from "src/PromoFactory.sol";

contract PromoFactoryScript is Script {
    PromoFactory promoFactoryImplementation;
    TransparentUpgradeableProxy promoFactoryProxy;

    function run(
        address proxyAdmin,
        address paymentToken,
        address paymentRecipient,
        uint256 promoCreationPrice
    ) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        bytes memory promoFactoryData = abi.encodeWithSignature(
            "initialize(address,address,uint256)",
            paymentToken,
            paymentRecipient,
            promoCreationPrice
        );

        vm.startBroadcast(deployerPrivateKey);

        promoFactoryImplementation = new PromoFactory();

        promoFactoryProxy = new TransparentUpgradeableProxy(
            address(promoFactoryImplementation),
            address(proxyAdmin),
            promoFactoryData
        );

        vm.stopBroadcast();

        console.log("------------------ Deployed contracts --------------------");
        console.log("PromoFactory");
        console.log("Implementation   : ", address(promoFactoryImplementation));
        console.log("Proxy            : ", address(promoFactoryProxy));
        console.log("ProxyAdmin       : ", proxyAdmin);
        console.log("------------------ Deployment info -----------------------");
        console.log("Chin id          : ", block.chainid);
        console.log("Deployer         : ", vm.addr(deployerPrivateKey));
    }
}
