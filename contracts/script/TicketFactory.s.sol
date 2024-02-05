// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";

import {TransparentUpgradeableProxy} from
    "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

import {TicketFactory} from "src/TicketFactory.sol";

contract TicketFactoryScript is Script {
    ProxyAdmin proxyAdmin;
    TicketFactory factoryImplementation;
    TransparentUpgradeableProxy factoryProxy;

    function run(
        address admin,
        address saleImpl,
        address ticketImpl,
        address protocolFeeRecipient,
        uint256 protocolFee,
        uint256 maxSalePeriod
    ) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        bytes memory factoryData = abi.encodeWithSignature(
            "initialize(address,address,address,uint256,uint256)",
            address(saleImpl),
            address(ticketImpl),
            protocolFeeRecipient,
            protocolFee,
            maxSalePeriod
        );

        console.logBytes(factoryData);

        vm.startBroadcast(deployerPrivateKey);

        proxyAdmin = new ProxyAdmin(admin);
        factoryImplementation = new TicketFactory();

        factoryProxy = new TransparentUpgradeableProxy(
            address(factoryImplementation), address(proxyAdmin), factoryData
        );

        vm.stopBroadcast();

        console.log("------------------ Deployed contracts --------------------");
        console.log("TicketFactory");
        console.log("Implementation   : ", address(factoryImplementation));
        console.log("Proxy            : ", address(factoryProxy));
        console.log("ProxyAdmin       : ", address(proxyAdmin));
        console.log("------------------ Deployment info -----------------------");
        console.log("Chin id          : ", block.chainid);
        console.log("Deployer         : ", vm.addr(deployerPrivateKey));
    }
}
