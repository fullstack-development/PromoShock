// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface ITicket {
    function totalSupply() external view returns (uint256);

    function getAllOwners() external view returns (address[] memory);
}
