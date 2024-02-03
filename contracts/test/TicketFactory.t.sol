// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";

import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

import {TicketFactory} from "src/TicketFactory.sol";
import {TicketSale, SaleParams} from "src/TicketSale.sol";
import {Ticket, TicketParams} from "src/Ticket.sol";

contract TicketFactoryTest is Test {
    TicketFactory factory;
    TicketSale saleImpl;
    Ticket ticketImpl;
    ERC20Mock paymentToken;

    uint16 constant CAP = 100;
    uint256 constant TOKEN_ID = 1;
    uint256 constant MAX_SALE_PERIOD = 30 days;
    uint256 constant PROTOCOL_FEE = 100;
    string constant BASE_URI = "ipfs://testTokenUri/";
    string constant CONTRACT_URI = "ipfs://testContractUri";
    address STREAMER;
    address ALICE;
    address BOB;
    address PROTOCOL_FEE_RECIPIENT;

    function setUp() public {
        STREAMER = makeAddr("STREAMER");
        ALICE = makeAddr("ALICE");
        BOB = makeAddr("BOB");
        PROTOCOL_FEE_RECIPIENT = makeAddr("PROTOCOL_FEE_RECIPIENT");

        saleImpl = new TicketSale();
        ticketImpl = new Ticket();

        factory =
        new TicketFactory(address(saleImpl), address(ticketImpl), PROTOCOL_FEE_RECIPIENT, PROTOCOL_FEE, MAX_SALE_PERIOD);

        paymentToken = new ERC20Mock();
    }

    // region - createTicketSale

    function test_createTicketSale() public {
        SaleParams memory sale =
            SaleParams(block.timestamp, block.timestamp + 1, 1 ether, address(paymentToken));

        TicketParams memory ticket = TicketParams("Test", "T", BASE_URI, CONTRACT_URI, CAP);

        vm.prank(STREAMER);
        (address ticketSaleAddr, address ticketAddr) = factory.createTicketSale(sale, ticket);

        assertEq(Ticket(ticketSaleAddr).owner(), STREAMER);
        assertEq(Ticket(ticketAddr).owner(), ticketSaleAddr);
    }

    function test_createTicketSale_revert_ifMaxSalePeriodExceeded() public {
        SaleParams memory sale = SaleParams(
            block.timestamp, block.timestamp + MAX_SALE_PERIOD + 1, 1 ether, address(paymentToken)
        );

        TicketParams memory ticket = TicketParams("Test", "T", BASE_URI, CONTRACT_URI, CAP);

        vm.expectRevert(
            abi.encodeWithSelector(TicketFactory.MaxSalePeriodExceeded.selector, MAX_SALE_PERIOD)
        );

        factory.createTicketSale(sale, ticket);
    }

    // endregion

    // region - Initialize

    function test_initialize() public {
        assertEq(factory.owner(), address(this));
        assertEq(factory.MAX_PROTOCOL_FEE(), 1000);
        assertEq(factory.getMaxSalePeriod(), MAX_SALE_PERIOD);
    }

    function test_initialize_revert_ifZeroAddress() public {
        ticketImpl = new Ticket();

        vm.expectRevert(TicketFactory.ZeroAddress.selector);

        new TicketFactory(address(0), address(ticketImpl), PROTOCOL_FEE_RECIPIENT, PROTOCOL_FEE, MAX_SALE_PERIOD);

        vm.expectRevert(TicketFactory.ZeroAddress.selector);

        new TicketFactory(address(saleImpl), address(0), PROTOCOL_FEE_RECIPIENT, PROTOCOL_FEE, MAX_SALE_PERIOD);
        
    }

    // endregion

    // region - Setters

    function test_setMaxSalePeriod() public {
        assertEq(factory.getMaxSalePeriod(), MAX_SALE_PERIOD);

        uint256 newMaxPeriod = 2 days;

        factory.setMaxSalePeriod(newMaxPeriod);

        assertEq(factory.getMaxSalePeriod(), newMaxPeriod);
    }

    function test_setMaxSalePeriod_revert_ifMaxSalePeriodIsTooLow() public {
        uint256 newMaxPeriod = 1 minutes;

        vm.expectRevert(TicketFactory.MaxSalePeriodIsTooLow.selector);

        factory.setMaxSalePeriod(newMaxPeriod);
    }

    function test_setProtocolFee() public {
        assertEq(factory.getProtocolFee(), PROTOCOL_FEE);

        uint256 newProtocolFee = 200;

        factory.setProtocolFee(newProtocolFee);

        assertEq(factory.getProtocolFee(), newProtocolFee);
    }

    function test_setProtocolFee_revert_ifProtocolFeeIsTooHigh() public {
        uint256 newProtocolFee = factory.MAX_PROTOCOL_FEE() + 1;

        vm.expectRevert(
            abi.encodeWithSelector(
                TicketFactory.ProtocolFeeIsTooHigh.selector, factory.MAX_PROTOCOL_FEE()
            )
        );

        factory.setProtocolFee(newProtocolFee);
    }

    // endregion
}
