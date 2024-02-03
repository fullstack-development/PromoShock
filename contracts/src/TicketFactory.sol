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
    address private _protocolFeeRecipient;

    /// Events

    event TicketSaleCreated(
        address indexed creator, address indexed ticketSaleAddr, address indexed ticketAddr
    );
    event MaxSalePeriodSet(uint256 newMaxPeriod);
    event ProtocolFeeSet(uint256 newProtocolFee);
    event ProtocolFeeRecipientSet(address newRecipient);
    event TicketSaleImplementationSet(address newImplementation);
    event TicketImplementationSet(address newImplementation);

    /// Errors

    error ZeroAddress();
    error MaxSalePeriodIsTooLow();
    error MaxSalePeriodExceeded(uint256 maxPeriod);
    error ProtocolFeeIsTooHigh(uint256 maxProtocolFee);

    constructor(
        address ticketSaleImplementation,
        address ticketImplementation,
        address protocolFeeRecipient,
        uint256 protocolFee,
        uint256 maxSalePeriod
    ) Ownable(msg.sender) {
        setTicketSaleImplementation(ticketSaleImplementation);
        setTicketImplementation(ticketImplementation);
        setProtocolFeeRecipient(protocolFeeRecipient);
        setMaxSalePeriod(maxSalePeriod);
        setProtocolFee(protocolFee);
    }

    modifier checkAddress(address target) {
        if (target == address(0)) {
            revert ZeroAddress();
        }

        _;
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

        ticketAddr = TicketSale(ticketSaleAddr).initialize(
            _ticketImplementation, msg.sender, _protocolFee, _protocolFeeRecipient, sale, ticket
        );

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

    function setProtocolFeeRecipient(address newRecipient)
        public
        onlyOwner
        checkAddress(newRecipient)
    {
        _protocolFeeRecipient = newRecipient;

        emit ProtocolFeeRecipientSet(newRecipient);
    }

    function setTicketSaleImplementation(address newImplementation)
        public
        onlyOwner
        checkAddress(newImplementation)
    {
        _ticketSaleImplementation = newImplementation;

        emit TicketSaleImplementationSet(newImplementation);
    }

    function setTicketImplementation(address newImplementation)
        public
        onlyOwner
        checkAddress(newImplementation)
    {
        _ticketImplementation = newImplementation;

        emit TicketImplementationSet(newImplementation);
    }

    function getMaxSalePeriod() external view returns (uint256) {
        return _maxSalePeriod;
    }

    function getProtocolFee() external view returns (uint256) {
        return _protocolFee;
    }

    // endregion
}
