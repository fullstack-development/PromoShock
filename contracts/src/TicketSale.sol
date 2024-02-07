// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Initializable} from "@openzeppelin-upgradeable/contracts/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin-upgradeable/contracts/access/OwnableUpgradeable.sol";

import {ITicket} from "src/interfaces/ITicket.sol";
import {Ticket, TicketParams} from "src/Ticket.sol";

struct SaleParams {
    uint256 startTime;
    uint256 endTime;
    uint256 price;
    address paymentToken;
}

contract TicketSale is Initializable, OwnableUpgradeable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 private constant _BASE_FEE_POINTS = 10_000; // 100%

    SaleParams private _sale;

    Ticket private _ticket;
    uint256 private _totalRaised;
    uint256 private _protocolFee;
    address private _protocolFeeRecipient;

    event SaleAdded(
        address indexed streamer, uint256 protocolFee, SaleParams sale, TicketParams ticketParams
    );
    event Sold(
        address indexed buyer,
        address indexed ticket,
        uint256 tokenId,
        uint256 price,
        uint256 timestamp
    );
    event Refund(address indexed sender, uint256 tokenId, uint256 price);
    event Withdrawn(address indexed owner, uint256 amount, uint256 fee);

    error InvalidTimeSettings();
    error ZeroAddress();
    error SaleShouldBeActive();
    error SaleShouldEnd();
    error SaleIsEnded();
    error YouHaveAlreadyPurchasedTicket();

    constructor() {
        _disableInitializers();
    }

    modifier whenSaleActive() {
        if (block.timestamp < _sale.startTime || block.timestamp > _sale.endTime) {
            revert SaleShouldBeActive();
        }

        _;
    }

    modifier whenSaleEnded() {
        if (block.timestamp < _sale.endTime) {
            revert SaleShouldEnd();
        }

        _;
    }

    modifier whenSaleNotEnded() {
        if (block.timestamp >= _sale.endTime) {
            revert SaleIsEnded();
        }

        _;
    }

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

    function buy() external whenSaleActive nonReentrant {
        SaleParams memory sale = _sale;

        if (_ticket.balanceOf(msg.sender) != 0) {
            revert YouHaveAlreadyPurchasedTicket();
        }

        _totalRaised += sale.price;

        IERC20(sale.paymentToken).safeTransferFrom(msg.sender, address(this), sale.price);

        uint256 tokenId = _ticket.safeMint(msg.sender);

        assert(_totalRaised == IERC20(sale.paymentToken).balanceOf(address(this)));

        emit Sold(msg.sender, address(_ticket), tokenId, sale.price, block.timestamp);
    }

    function refund(uint256 tokenId) external whenSaleNotEnded {
        SaleParams memory sale = _sale;

        _totalRaised -= sale.price;
        _ticket.burn(msg.sender, tokenId);
        IERC20(sale.paymentToken).safeTransfer(msg.sender, sale.price);

        emit Refund(msg.sender, tokenId, sale.price);
    }

    function withdraw() external onlyOwner whenSaleEnded {
        uint256 protocolFee = _totalRaised * _protocolFee / _BASE_FEE_POINTS;
        uint256 withdrawnAmount = _totalRaised - protocolFee;

        IERC20(_sale.paymentToken).safeTransfer(_protocolFeeRecipient, protocolFee);
        IERC20(_sale.paymentToken).safeTransfer(owner(), withdrawnAmount);

        emit Withdrawn(owner(), withdrawnAmount, protocolFee);
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
}
