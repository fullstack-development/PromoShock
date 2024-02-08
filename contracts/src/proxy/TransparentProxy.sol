// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {TransparentUpgradeableProxy} from
    "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ERC1967Utils} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Utils.sol";

contract TransparentProxy is TransparentUpgradeableProxy {
    constructor(address logic, address initialOwner, bytes memory data)
        TransparentUpgradeableProxy(logic, initialOwner, data)
    {}

    function getAdmin() external view returns (address) {
        return ERC1967Utils.getAdmin();
    }

    function getImplementation() external view returns (address) {
        return ERC1967Utils.getImplementation();
    }

    receive() external payable {
        revert();
    }
}
