// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {TicketSale, SaleParams, TicketParams} from "src/TicketSale.sol";
import {TicketParams} from "src/Ticket.sol";

contract TicketFactory is Ownable {
    uint256 public constant MAX_PROTOCOL_FEE = 1_000; // The maximum team fee is equal to 10%

    address private _ticketSaleImplementation;
    address private _ticketImplementation;
    uint256 private _maxSalePeriod;
    uint256 private _protocolFee;

    /// Events

    event TicketSaleCreated(
        address indexed creator, address indexed ticketSaleAddr, address indexed ticketAddr
    );
    event MaxSalePeriodSet(uint256 newMaxPeriod);
    event ProtocolFeeSet(uint256 newProtocolFee);

    /// Errors

    error ZeroAddress();
    error MaxSalePeriodIsTooLow();
    error MaxSalePeriodExceeded(uint256 maxPeriod);
    error ProtocolFeeIsTooHigh(uint256 maxProtocolFee);

    constructor(
        address ticketSaleImplementation,
        address ticketImplementation,
        uint256 maxSalePeriod,
        uint256 protocolFee
    ) Ownable(msg.sender) {
        if (ticketSaleImplementation == address(0) || ticketImplementation == address(0)) {
            revert ZeroAddress();
        }

        setMaxSalePeriod(maxSalePeriod);
        setProtocolFee(protocolFee);

        _ticketSaleImplementation = ticketSaleImplementation;
        _ticketImplementation = ticketImplementation;
        _maxSalePeriod = maxSalePeriod;
    }

    // region - Create Ticket Sale

    function createTicketSale(SaleParams calldata sale, TicketParams calldata ticket)
        external
        returns (address ticketSaleAddr, address ticketAddr)
    {
        if (sale.endTime > sale.startTime && (sale.endTime - sale.startTime) > _maxSalePeriod) {
            revert MaxSalePeriodExceeded(_maxSalePeriod);
        }

        ticketSaleAddr = Clones.clone(address(_ticketSaleImplementation));

        ticketAddr =
            TicketSale(ticketSaleAddr).initialize(_ticketImplementation, msg.sender, sale, ticket);

        emit TicketSaleCreated(msg.sender, ticketSaleAddr, ticketAddr);
    }

    // endregion

    // region - Setters and Getters

    function setMaxSalePeriod(uint256 newMaxPeriod) public onlyOwner {
        if (newMaxPeriod < 1 days) {
            revert MaxSalePeriodIsTooLow();
        }

        _maxSalePeriod = newMaxPeriod;

        emit MaxSalePeriodSet(newMaxPeriod);
    }

    function setProtocolFee(uint256 newProtocolFee) public onlyOwner {
        if (newProtocolFee > MAX_PROTOCOL_FEE) {
            revert ProtocolFeeIsTooHigh(MAX_PROTOCOL_FEE);
        }

        _protocolFee = newProtocolFee;

        emit ProtocolFeeSet(newProtocolFee);
    }

    function getMaxSalePeriod() external view returns (uint256) {
        return _maxSalePeriod;
    }

    function getProtocolFee() external view returns (uint256) {
        return _protocolFee;
    }

    // endregion
}
