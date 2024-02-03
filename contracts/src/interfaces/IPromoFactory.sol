// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Promotion} from "src/Promo.sol";

interface IPromoFactory {
    function getAvailablePromotions(address stream) external view returns (Promotion[] memory);
}
