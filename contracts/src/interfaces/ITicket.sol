// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ITicket is IERC721 {
    function totalSupply() external view returns (uint256);

    function getAllOwners() external view returns (address[] memory);

    function safeMint(address to) external returns (uint256);

    function burn(uint256 tokenId) external;
}
