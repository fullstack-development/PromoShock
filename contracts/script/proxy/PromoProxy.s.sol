// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";

import {TransparentProxy} from "src/proxy/TransparentProxy.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

import {Promo} from "src/Promo.sol";

contract PromoProxyScript is Script {
    TransparentProxy promoProxy;

    function run(
        address initialOwner,
        address promoImpl,
        address promoFactory,
        string calldata contractUri
    ) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        bytes memory promoData =
            abi.encodeWithSignature("initialize(address,string)", promoFactory, contractUri);

        vm.startBroadcast(deployerPrivateKey);

        promoProxy = new TransparentProxy(address(promoImpl), initialOwner, promoData);

        address proxyAdmin = promoProxy.getAdmin();

        vm.stopBroadcast();

        console.log("------------------ Deployed contracts --------------------");
        console.log("Promo");
        console.log("Implementation   : ", promoImpl);
        console.log("Proxy            : ", address(promoProxy));
        console.log("ProxyAdmin       : ", proxyAdmin);
        console.log("------------------ Deployment info -----------------------");
        console.log("Chin id          : ", block.chainid);
        console.log("Deployer         : ", vm.addr(deployerPrivateKey));
    }
}
