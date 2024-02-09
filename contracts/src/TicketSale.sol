// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Initializable} from "@openzeppelin-upgradeable/contracts/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin-upgradeable/contracts/access/OwnableUpgradeable.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

import {ITicket} from "src/interfaces/ITicket.sol";
import {Ticket, TicketParams} from "src/Ticket.sol";

struct SaleParams {
    uint256 startTime;
    uint256 endTime;
    uint256 price;
    address paymentToken;
}

/**
 * @title TicketSale contract
 * @notice The contract can make ticket sales.
 * In the case of successful sales, a protocol fee will be charged.
 *
 * The contract is managed by Owner role.
 *
 * The owner can withdraw the collected funds after the end of sales.
 * The owner can change the start and end times prior to the start of sales.
 *
 * @dev A new instance is created based on EIP-1167 using
 * the library https://docs.openzeppelin.com/contracts/5.x/api/proxy#Clones
 */
contract TicketSale is Initializable, OwnableUpgradeable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 private constant _BASE_FEE_POINTS = 10_000; // Allows to set percentages in the range from 0.01% to 100%

    SaleParams private _sale;
    Ticket private _ticket;

    uint256 private _totalRaised;
    uint256 private _protocolFee;
    address private _protocolFeeRecipient;

    /// Events

    event Refund(address indexed buyer, uint256 tokenId, uint256 price);
    event Sold(
        address indexed buyer,
        address indexed ticket,
        uint256 tokenId,
        uint256 price,
        uint256 timestamp
    );
    event SaleAdded(
        address indexed streamer, uint256 protocolFee, SaleParams sale, TicketParams ticketParams
    );
    event SaleTimeSettingsChanged(uint256 startTime, uint256 endTime);
    event Withdrawn(address indexed streamer, uint256 amount, uint256 fee);

    /// Errors

    error InvalidTimeSettings();
    error SalesShouldBeActive();
    error SalesShouldEnd();
    error SalesAlreadyStarted();
    error YouHaveAlreadyPurchasedTicket();
    error ZeroAddress();

    /// Modifiers

    /// @notice Checks that sales have started and not yet ended
    modifier whenSalesActive() {
        if (block.timestamp < _sale.startTime || block.timestamp > _sale.endTime) {
            revert SalesShouldBeActive();
        }

        _;
    }

    /// @notice Checks to see if the sales is over
    modifier whenSalesEnded() {
        if (block.timestamp < _sale.endTime) {
            revert SalesShouldEnd();
        }

        _;
    }

    /// @notice Checks that sales have not started
    modifier whenSalesNotStarted() {
        if (block.timestamp >= _sale.startTime) {
            revert SalesAlreadyStarted();
        }

        _;
    }

    constructor() {
        _disableInitializers();
    }

    // region - Initialize

    /**
     * @notice Initializes a new sale instance with the provided parameters and creates a ticket contract
     * @param ticketImplementation The address of the ticket contract implementation to clone for this sale
     * @param streamer The address of the streamer responsible for the sale
     * @param protocolFee The fee percentage (in basis points) that the protocol charges on sales
     * @param protocolFeeRecipient The address that will receive the collected protocol fees
     * @param sale A `SaleParams` struct containing the parameters of the sale
     * @param ticketParams A `TicketParams` struct containing the parameters for the tickets being created
     */
    function initialize(
        address ticketImplementation,
        address streamer,
        uint256 protocolFee,
        address protocolFeeRecipient,
        SaleParams calldata sale,
        TicketParams calldata ticketParams
    ) external initializer returns (address) {
        __Ownable_init(streamer);

        _checkSale(sale);
        _sale = sale;

        if (protocolFeeRecipient == address(0)) {
            revert ZeroAddress();
        }
        _protocolFee = protocolFee;
        _protocolFeeRecipient = protocolFeeRecipient;

        _ticket = Ticket(Clones.clone(address(ticketImplementation)));
        _ticket.initialize(ticketParams, streamer);

        emit SaleAdded(streamer, protocolFee, sale, ticketParams);

        return address(_ticket);
    }

    function _checkSale(SaleParams calldata sale) private view {
        _validateTime(sale.startTime, sale.endTime);

        if (sale.paymentToken == address(0)) {
            revert ZeroAddress();
        }
    }

    function _validateTime(uint256 startTime, uint256 endTime) private view {
        if (startTime < block.timestamp || endTime <= startTime) {
            revert InvalidTimeSettings();
        }
    }

    // endregion

    // region - Buy

    /**
     * @notice Allows to buy tickets during the sales
     * @dev Only one ticket may be purchased per address
     */
    function buy() external whenSalesActive nonReentrant {
        SaleParams memory sale = _sale;

        if (_ticket.balanceOf(msg.sender) != 0) {
            revert YouHaveAlreadyPurchasedTicket();
        }

        _totalRaised += sale.price;

        IERC20(sale.paymentToken).safeTransferFrom(msg.sender, address(this), sale.price);
        uint256 tokenId = _ticket.safeMint(msg.sender);

        emit Sold(msg.sender, address(_ticket), tokenId, sale.price, block.timestamp);
    }

    // endregion

    // region - Refund

    /**
     * @notice Allows to request a refund before the end of ticket sales
     * @dev Upon refund, the ticket is burned
     */
    function refund(uint256 tokenId) external whenSalesActive {
        SaleParams memory sale = _sale;

        _ticket.burn(msg.sender, tokenId);
        _totalRaised -= sale.price;
        IERC20(sale.paymentToken).safeTransfer(msg.sender, sale.price);

        emit Refund(msg.sender, tokenId, sale.price);
    }

    // endregion

    // region - Withdraw

    /**
     * @notice Allows withdrawal of funds collected from sales
     * @dev Only withdraw funds after the end of the sales. Protocol fee is charged
     */
    function withdraw() external onlyOwner whenSalesEnded {
        uint256 protocolFee = _totalRaised * _protocolFee / _BASE_FEE_POINTS;
        uint256 withdrawnAmount = _totalRaised - protocolFee;

        IERC20(_sale.paymentToken).safeTransfer(_protocolFeeRecipient, protocolFee);
        IERC20(_sale.paymentToken).safeTransfer(owner(), withdrawnAmount);

        emit Withdrawn(owner(), withdrawnAmount, protocolFee);
    }

    // endregion

    // region - Setters and Getters

    function setTimeSettings(uint256 startTime, uint256 endTime)
        external
        onlyOwner
        whenSalesNotStarted
    {
        _validateTime(startTime, endTime);

        _sale.startTime = startTime;
        _sale.endTime = endTime;

        emit SaleTimeSettingsChanged(startTime, endTime);
    }

    function getSaleParams() external view returns (SaleParams memory) {
        return _sale;
    }

    function getProtocolFee() external view returns (uint256) {
        return _protocolFee;
    }

    function getTotalRaised() external view returns (uint256) {
        return _totalRaised;
    }

    // endregion
}
