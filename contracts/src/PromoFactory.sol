// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IPromo} from "src/interfaces/IPromo.sol";
import {Promotion} from "src/Promo.sol";

contract PromoFactory is Ownable {
    using SafeERC20 for IERC20;

    IERC20 private _paymentToken;
    address private _paymentRecipient;
    uint256 private _promoCreationPrice;

    mapping(address stream => Promotion[] promotion) private _promoRegistry;

    /// Events

    event PromotionCreated(address indexed marketer, Promotion promotion);
    event PaymentTokenSet(address token);
    event PaymentRecipientSet(address recipient);
    event PromoCreationPriceSet(uint256 price);

    /// Errors

    error ZeroAddress();

    constructor(address paymentToken, address paymentRecipient, uint256 promoCreationPrice)
        Ownable(msg.sender)
    {
        setPaymentToken(paymentToken);
        setPaymentRecipient(paymentRecipient);
        setPromoCreationPrice(promoCreationPrice);
    }

    modifier checkAddress(address target) {
        if (target == address(0)) {
            revert ZeroAddress();
        }

        _;
    }

    function createPromo(Promotion calldata promotion, string calldata uri) external {
        uint256 streamAmount = promotion.streams.length;
        uint256 price = _promoCreationPrice * streamAmount;

        _paymentToken.safeTransferFrom(msg.sender, _paymentRecipient, price);
        IPromo(promotion.promoAddr).safeMint(msg.sender, uri, promotion);

        for (uint256 i; i < streamAmount; i++) {
            _promoRegistry[promotion.streams[i]].push(promotion);
        }

        emit PromotionCreated(msg.sender, promotion);
    }

    // region - Setters

    function setPromoCreationPrice(uint256 price) public onlyOwner {
        _promoCreationPrice = price;

        emit PromoCreationPriceSet(price);
    }

    function setPaymentToken(address token) public checkAddress(token) onlyOwner {
        _paymentToken = IERC20(token);

        emit PaymentTokenSet(token);
    }

    function setPaymentRecipient(address recipient) public checkAddress(recipient) onlyOwner {
        _paymentRecipient = recipient;

        emit PaymentRecipientSet(recipient);
    }

    // endregion

    // region - Getters

    function getAvailablePromotions(address stream) external view returns (Promotion[] memory) {
        return _promoRegistry[stream];
    }

    function getPromoCreationPrice() external view returns (uint256) {
        return _promoCreationPrice;
    }

    function getPaymentTokenAddress() external view returns (address) {
        return address(_paymentToken);
    }

    function getPaymentRecipientAddress() external view returns (address) {
        return _paymentRecipient;
    }

    // endregion
}
