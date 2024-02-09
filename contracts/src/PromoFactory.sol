// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "@openzeppelin-upgradeable/contracts/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin-upgradeable/contracts/access/OwnableUpgradeable.sol";

import {IPromo} from "src/interfaces/IPromo.sol";
import {Promotion} from "src/Promo.sol";

/**
 * @title PromoFactory contract
 * @notice A contract that creates promotions using the Promo collection.
 * Every promotion is a nft (ERC721).
 *
 * The contract is managed by Owner role.
 *
 * The owner can set on a smart contract:
 * - the price of creating a promotional share
 * - payment token
 * - payee
 */
contract PromoFactory is Initializable, OwnableUpgradeable {
    using SafeERC20 for IERC20;

    IERC20 private _paymentToken;
    address private _paymentRecipient;
    uint256 private _promoCreationPrice;

    mapping(address stream => Promotion[] promotion) private _promoRegistry;

    /// Events

    event PaymentRecipientSet(address indexed recipient);
    event PaymentTokenSet(address token);
    event PromotionCreated(address indexed marketer, Promotion promotion);
    event PromoCreationPriceSet(uint256 price);

    /// Errors

    error ZeroAddress();

    /// Modifiers

    /// @notice Checks that the address is not zero address
    modifier checkAddress(address target) {
        if (target == address(0)) {
            revert ZeroAddress();
        }

        _;
    }

    constructor() {
        _disableInitializers();
    }

    // region - Initialize

    /**
     * @notice Initializes the PromoFactory contract
     * @param paymentToken The address of the token used for payments
     * @param paymentRecipient The address that will receive payments
     * @param promoCreationPrice The price (in paymentToken units) for creating a new promo
     */
    function initialize(address paymentToken, address paymentRecipient, uint256 promoCreationPrice)
        external
        initializer
    {
        __Ownable_init(msg.sender);

        setPaymentToken(paymentToken);
        setPaymentRecipient(paymentRecipient);
        setPromoCreationPrice(promoCreationPrice);
    }

    // endregion

    // region - Create promo

    /**
     * @notice Creates a new promo with specified promotion details and URI
     * @param promotion A `Promotion` struct containing the details of the promotion
     * @param uri The URI for the promo metadata
     * @dev This function calculates the price for creating a promo based
     * on the number of streams specified in the `promotion` struct,
     * multiplied by the `_promoCreationPrice`
     */
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

    // endregion

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
