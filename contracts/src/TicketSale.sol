// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Initializable} from "@openzeppelin-upgradeable/contracts/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin-upgradeable/contracts/access/OwnableUpgradeable.sol";

import {Ticket, TicketParams} from "src/Ticket.sol";

struct SaleParams {
    uint256 startTime;
    uint256 endTime;
    uint256 rate;
    address paymentToken;
}

contract TicketSale is Initializable, OwnableUpgradeable {
    using SafeERC20 for IERC20;

    SaleParams private _sale;
    uint8 private _paymentTokenDec;

    uint256 private constant _BASE_FEE_POINTS = 10_000;
    uint256 private constant _MAX_PROTOCOL_FEE = 5_000;

    event SaleAdded(address indexed streamer, SaleParams sale, TicketParams ticket);

    error InvalidTimeSettings();
    error ZeroAddress();

    constructor() {
        _disableInitializers();
    }

    function initialize(
        address ticketImplementation,
        address streamer,
        SaleParams calldata sale,
        TicketParams calldata ticket
    ) external initializer returns (address ticketAddr) {
        __Ownable_init(streamer);

        _checkSale(sale);

        _sale = sale;
        _paymentTokenDec = IERC20Metadata(sale.paymentToken).decimals();

        ticketAddr = Clones.clone(address(ticketImplementation));
        Ticket(ticketAddr).initialize(ticket, address(this));

        // TODO event
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

    function getSaleParams() external view returns (SaleParams memory) {
        return _sale;
    }
}
