//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Promotion} from "src/Promo.sol";

interface IPromo {
    function safeMint(address to, string calldata uri, Promotion calldata promotion) external;
}
