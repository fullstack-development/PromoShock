// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Initializable} from "@openzeppelin-upgradeable/contracts/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin-upgradeable/contracts/access/OwnableUpgradeable.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

import {TicketSale, SaleParams, TicketParams} from "src/TicketSale.sol";
import {TicketParams} from "src/Ticket.sol";

/**
 * @title TicketFactory contract
 * @notice A contract that creates tickets (ERC721 collection) and ticket sales.
 *
 * The contract is managed by Owner role.
 *
 * The owner can set on a smart contract:
 * - maximum sales period
 * - protocol fee on ticket sales
 * - fee recipient
 * - implementation of the TicketSale smart contract
 * - implementation of the Ticket smart contract
 */
contract TicketFactory is Initializable, OwnableUpgradeable {
    uint256 public constant MAX_PROTOCOL_FEE = 1_000; // The maximum team fee is equal to 10%

    address private _ticketSaleImplementation;
    address private _ticketImplementation;
    uint256 private _maxSalePeriod;
    uint256 private _protocolFee;
    address private _protocolFeeRecipient;

    /// Events

    event MaxSalePeriodSet(uint256 newMaxPeriod);
    event ProtocolFeeRecipientSet(address newRecipient);
    event ProtocolFeeSet(uint256 newProtocolFee);
    event TicketImplementationSet(address newImplementation);
    event TicketSaleCreated(
        address indexed creator, address indexed ticketSaleAddr, address indexed ticketAddr
    );
    event TicketSaleImplementationSet(address newImplementation);

    /// Errors

    error MaxSalePeriodExceeded(uint256 maxPeriod);
    error MaxSalePeriodIsTooLow();
    error ProtocolFeeIsTooHigh(uint256 maxProtocolFee);
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

    /**
     * @notice Initializes the TicketFactory contract
     * @param ticketSaleImplementation The address of the ticket sale implementation contract
     * @param ticketImplementation The address of the ticket implementation contract
     * @param protocolFeeRecipient The address that will receive collected protocol fees
     * @param protocolFee The fee percentage (in basis points) that the protocol charges on sales
     * @param maxSalePeriod The maximum duration (in seconds) that a ticket sale can last.
     */
    function initialize(
        address ticketSaleImplementation,
        address ticketImplementation,
        address protocolFeeRecipient,
        uint256 protocolFee,
        uint256 maxSalePeriod
    ) external initializer {
        __Ownable_init(msg.sender);

        setTicketSaleImplementation(ticketSaleImplementation);
        setTicketImplementation(ticketImplementation);
        setProtocolFeeRecipient(protocolFeeRecipient);
        setMaxSalePeriod(maxSalePeriod);
        setProtocolFee(protocolFee);
    }

    // region - Create Ticket Sale

    /**
     * @notice Creates a new ticket sale with specified sale and ticket parameters
     * @param sale A `SaleParams` struct containing parameters for the sale
     * @param ticket A `TicketParams` struct containing parameters for the tickets being sold
     * @return ticketSaleAddr The address of the newly created ticket sale contract
     * @return ticketAddr The address of the ticket contract associated with the ticket sale
     * @dev This function creates a collection of tickets and a smart contract to sell those tickets
     */
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

    // region - Setters

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

    // endregion

    // region - Getters

    function getImplementations() external view returns (address sale, address ticket) {
        sale = _ticketSaleImplementation;
        ticket = _ticketImplementation;
    }

    function getMaxSalePeriod() external view returns (uint256) {
        return _maxSalePeriod;
    }

    function getProtocolFee() external view returns (uint256) {
        return _protocolFee;
    }

    // endregion
}
