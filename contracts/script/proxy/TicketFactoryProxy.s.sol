// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";

import {TransparentProxy} from "src/proxy/TransparentProxy.sol";
import {TicketFactory} from "src/TicketFactory.sol";

contract TicketFactoryProxyScript is Script {
    TransparentProxy factoryProxy;

    function run(
        address initialOwner,
        address saleImpl,
        address ticketImpl,
        address ticketFactoryImpl,
        address protocolFeeRecipient,
        uint256 protocolFee,
        uint256 maxSalePeriod
    ) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        bytes memory factoryData = abi.encodeWithSignature(
            "initialize(address,address,address,uint256,uint256)",
            saleImpl,
            ticketImpl,
            protocolFeeRecipient,
            protocolFee,
            maxSalePeriod
        );

        vm.startBroadcast(deployerPrivateKey);

        factoryProxy = new TransparentProxy(
            address(ticketFactoryImpl), initialOwner, factoryData
        );

        address proxyAdmin = factoryProxy.getAdmin();

        vm.stopBroadcast();

        console.log("------------------ Deployed contracts --------------------");
        console.log("TicketFactory");
        console.log("Implementation   : ", ticketFactoryImpl);
        console.log("Proxy            : ", address(factoryProxy));
        console.log("ProxyAdmin       : ", proxyAdmin);
        console.log("------------------ Deployment info -----------------------");
        console.log("Chin id          : ", block.chainid);
        console.log("Deployer         : ", vm.addr(deployerPrivateKey));
    }
}
