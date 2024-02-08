// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";

import {TransparentProxy} from "src/proxy/TransparentProxy.sol";
import {PromoFactory} from "src/PromoFactory.sol";

contract PromoFactoryProxyScript is Script {
    TransparentProxy promoFactoryProxy;

    function run(
        address initialOwner,
        address promoFactoryImpl,
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

        promoFactoryProxy = new TransparentProxy(
            address(promoFactoryImpl), initialOwner, promoFactoryData
        );

        address proxyAdmin = promoFactoryProxy.getAdmin();

        vm.stopBroadcast();

        console.log("------------------ Deployed contracts --------------------");
        console.log("PromoFactory");
        console.log("Implementation   : ", promoFactoryImpl);
        console.log("Proxy            : ", address(promoFactoryProxy));
        console.log("ProxyAdmin       : ", proxyAdmin);
        console.log("------------------ Deployment info -----------------------");
        console.log("Chin id          : ", block.chainid);
        console.log("Deployer         : ", vm.addr(deployerPrivateKey));
    }
}
