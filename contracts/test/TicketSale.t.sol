// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

import {TicketSale, SaleParams} from "src/TicketSale.sol";
import {Ticket, TicketParams} from "src/Ticket.sol";

contract TicketSaleTest is Test {
    Ticket ticketImpl;
    TicketSale ticketSale;
    ERC20Mock paymentToken;

    uint16 constant CAP = 100;
    uint256 constant TOKEN_ID = 1;
    uint256 constant PRICE = 1e18;
    uint256 constant PROTOCOL_FEE = 100;
    uint256 constant ALICE_FUNDS = 10e18;
    string constant BASE_URI = "ipfs://testTokenUri/";
    string constant CONTRACT_URI = "ipfs://testContractUri";
    address STREAMER;
    address ALICE;
    address BOB;
    address PROTOCOL_FEE_RECIPIENT;

    function setUp() external {
        STREAMER = makeAddr("STREAMER");
        ALICE = makeAddr("ALICE");
        BOB = makeAddr("BOB");
        PROTOCOL_FEE_RECIPIENT = makeAddr("PROTOCOL_FEE_RECIPIENT");

        TicketSale ticketSaleImpl = new TicketSale();
        ticketSale = TicketSale(Clones.clone(address(ticketSaleImpl)));

        ticketImpl = new Ticket();

        paymentToken = new ERC20Mock();
    }

    // region - Initialize

    function test_initialize() public {
        SaleParams memory saleParams =
            SaleParams(block.timestamp, block.timestamp + 1, PRICE, address(paymentToken));

        TicketParams memory ticketParams = TicketParams("Test", "T", BASE_URI, CAP);

        address ticketAddr = ticketSale.initialize(
            address(ticketImpl),
            STREAMER,
            PROTOCOL_FEE,
            PROTOCOL_FEE_RECIPIENT,
            saleParams,
            ticketParams
        );
        Ticket ticket = Ticket(ticketAddr);

        assertEq(ticket.name(), "Test");
        assertEq(ticket.symbol(), "T");
        assertEq(ticket.owner(), STREAMER);
        assertEq(ticket.CAP(), CAP);

        assertEq(ticketSale.owner(), STREAMER);
        assertEq(ticketSale.getProtocolFee(), PROTOCOL_FEE);

        SaleParams memory sale = ticketSale.getSaleParams();
        assertEq(sale.startTime, block.timestamp);
        assertEq(sale.endTime, block.timestamp + 1);
        assertEq(sale.price, PRICE);
        assertEq(sale.paymentToken, address(paymentToken));
    }

    function test_initialize_revert_ifZeroAddress() public {
        SaleParams memory saleParams =
            SaleParams(block.timestamp, block.timestamp + 1, PRICE, address(0));

        TicketParams memory ticketParams = TicketParams("Test", "T", BASE_URI, CAP);

        vm.expectRevert(TicketSale.ZeroAddress.selector);

        ticketSale.initialize(
            address(ticketImpl),
            STREAMER,
            PROTOCOL_FEE,
            PROTOCOL_FEE_RECIPIENT,
            saleParams,
            ticketParams
        );
    }

    function test_initialize_revert_ifInvalidTimeSettings() public {
        SaleParams memory saleParams =
            SaleParams(block.timestamp, block.timestamp + 1, PRICE, address(paymentToken));

        TicketParams memory ticketParams = TicketParams("Test", "T", BASE_URI, CAP);

        // Case 1. startTime < block.timestamp

        vm.warp(block.timestamp + 1);

        vm.expectRevert(TicketSale.InvalidTimeSettings.selector);

        ticketSale.initialize(
            address(ticketImpl),
            STREAMER,
            PROTOCOL_FEE,
            PROTOCOL_FEE_RECIPIENT,
            saleParams,
            ticketParams
        );

        vm.warp(block.timestamp - 1);

        // Case 2. startTime > endTime

        saleParams =
            SaleParams(block.timestamp + 2, block.timestamp + 1, PRICE, address(paymentToken));

        vm.expectRevert(TicketSale.InvalidTimeSettings.selector);

        ticketSale.initialize(
            address(ticketImpl),
            STREAMER,
            PROTOCOL_FEE,
            PROTOCOL_FEE_RECIPIENT,
            saleParams,
            ticketParams
        );

        // Case 3. startTime == endTime

        saleParams = SaleParams(block.timestamp, block.timestamp, PRICE, address(paymentToken));

        vm.expectRevert(TicketSale.InvalidTimeSettings.selector);

        ticketSale.initialize(
            address(ticketImpl),
            STREAMER,
            PROTOCOL_FEE,
            PROTOCOL_FEE_RECIPIENT,
            saleParams,
            ticketParams
        );
    }

    // endregion

    // region - buy

    function _beforePurchase() private returns (address ticketAddr) {
        SaleParams memory saleParams =
            SaleParams(block.timestamp, block.timestamp + 1, PRICE, address(paymentToken));

        TicketParams memory ticketParams = TicketParams("Test", "T", BASE_URI, CAP);

        vm.prank(STREAMER);
        ticketAddr = ticketSale.initialize(
            address(ticketImpl),
            STREAMER,
            PROTOCOL_FEE,
            PROTOCOL_FEE_RECIPIENT,
            saleParams,
            ticketParams
        );

        paymentToken.mint(ALICE, ALICE_FUNDS);

        vm.prank(ALICE);
        paymentToken.approve(address(ticketSale), PRICE);
    }

    function test_buy() public {
        Ticket ticket = Ticket(_beforePurchase());

        vm.prank(ALICE);
        ticketSale.buy();

        assertEq(ticket.balanceOf(ALICE), 1);
        assertEq(ticket.ownerOf(TOKEN_ID), ALICE);
        assertEq(ticket.totalSupply(), 1);
        assertEq(paymentToken.balanceOf(ALICE), ALICE_FUNDS - PRICE);
        assertEq(paymentToken.balanceOf(address(ticketSale)), PRICE);
        assertEq(ticketSale.getTotalRaised(), PRICE);
    }

    function test_buy_revert_ifSalesShouldBeActive() public {
        SaleParams memory saleParams =
            SaleParams(block.timestamp + 1, block.timestamp + 2, PRICE, address(paymentToken));

        TicketParams memory ticketParams = TicketParams("Test", "T", BASE_URI, CAP);

        ticketSale.initialize(
            address(ticketImpl),
            STREAMER,
            PROTOCOL_FEE,
            PROTOCOL_FEE_RECIPIENT,
            saleParams,
            ticketParams
        );

        vm.expectRevert(TicketSale.SalesShouldBeActive.selector);

        vm.prank(ALICE);
        ticketSale.buy();

        vm.warp(block.timestamp + 3);

        vm.expectRevert(TicketSale.SalesShouldBeActive.selector);

        vm.prank(ALICE);
        ticketSale.buy();
    }

    function test_buy_revert_ifHaveAlreadyPurchasedTicket() public {
        _beforePurchase();

        vm.prank(ALICE);
        ticketSale.buy();

        vm.expectRevert(TicketSale.YouHaveAlreadyPurchasedTicket.selector);

        vm.prank(ALICE);
        ticketSale.buy();
    }

    // endregion

    // region - refund

    function test_refund() public {
        Ticket ticket = Ticket(_beforePurchase());

        vm.prank(ALICE);
        ticketSale.buy();

        assertEq(ticketSale.getTotalRaised(), PRICE);
        assertEq(paymentToken.balanceOf(address(ticketSale)), PRICE);
        assertEq(paymentToken.balanceOf(ALICE), ALICE_FUNDS - PRICE);
        assertEq(ticket.balanceOf(ALICE), 1);
        assertEq(ticket.totalSupply(), 1);

        vm.startPrank(ALICE);
        ticket.approve(address(ticketSale), TOKEN_ID);
        ticketSale.refund(TOKEN_ID);
        vm.stopPrank();

        assertEq(ticketSale.getTotalRaised(), 0);
        assertEq(paymentToken.balanceOf(address(ticketSale)), 0);
        assertEq(paymentToken.balanceOf(ALICE), ALICE_FUNDS);
        assertEq(ticket.balanceOf(ALICE), 0);
        assertEq(ticket.totalSupply(), 0);
    }

    function test_refund_revert_ifNotOwnerOfApproval() public {
        Ticket ticket = Ticket(_beforePurchase());

        vm.startPrank(ALICE);
        ticketSale.buy();
        ticket.approve(address(ticketSale), TOKEN_ID);
        vm.stopPrank();

        vm.expectRevert(
            abi.encodeWithSignature("ERC721InsufficientApproval(address,uint256)", BOB, TOKEN_ID)
        );

        vm.prank(BOB);
        ticketSale.refund(TOKEN_ID);
    }

    function test_refund_revert_ifSaleNotActive() public {
        _beforePurchase();

        vm.prank(ALICE);
        ticketSale.buy();

        vm.warp(block.timestamp + 2);

        vm.prank(ALICE);
        vm.expectRevert(TicketSale.SalesShouldBeActive.selector);
        ticketSale.refund(TOKEN_ID);
    }

    // endregion

    // region - Withdraw

    function _beforeWithdraw() private {
        _beforePurchase();

        vm.prank(ALICE);
        ticketSale.buy();
    }

    function test_withdraw() public {
        _beforeWithdraw();

        vm.warp(block.timestamp + 2);

        uint256 totalRaised = ticketSale.getTotalRaised();

        assertEq(paymentToken.balanceOf(address(ticketSale)), totalRaised);
        assertEq(paymentToken.balanceOf(PROTOCOL_FEE_RECIPIENT), 0);
        assertEq(paymentToken.balanceOf(STREAMER), 0);

        vm.prank(STREAMER);
        ticketSale.withdraw();

        assertEq(paymentToken.balanceOf(address(ticketSale)), 0);

        uint256 protocolFee = totalRaised * PROTOCOL_FEE / 10_000;

        assertEq(paymentToken.balanceOf(PROTOCOL_FEE_RECIPIENT), protocolFee);
        assertEq(paymentToken.balanceOf(STREAMER), totalRaised - protocolFee);
    }

    function test_withdraw_revert_ifSaleNotEnd() public {
        _beforeWithdraw();

        vm.expectRevert(TicketSale.SalesShouldEnd.selector);

        vm.prank(STREAMER);
        ticketSale.withdraw();
    }

    // endregion

    // region - setTimeSettings

    function test_setTimeSettings() public {
        uint256 initialStartTime = block.timestamp + 1 days;
        uint256 initialEndTime = initialStartTime + 30 days;

        SaleParams memory saleParams =
            SaleParams(initialStartTime, initialEndTime, PRICE, address(paymentToken));

        TicketParams memory ticketParams = TicketParams("Test", "T", BASE_URI, CAP);

        vm.prank(STREAMER);
        ticketSale.initialize(
            address(ticketImpl),
            STREAMER,
            PROTOCOL_FEE,
            PROTOCOL_FEE_RECIPIENT,
            saleParams,
            ticketParams
        );

        uint256 newStartTime = block.timestamp;
        uint256 newEndTime = initialStartTime + 1 days;

        vm.prank(STREAMER);
        ticketSale.setTimeSettings(newStartTime, newEndTime);

        SaleParams memory sale = ticketSale.getSaleParams();

        assertEq(sale.startTime, newStartTime);
        assertEq(sale.endTime, newEndTime);
    }

    function test_setTimeSettings_revert_ifNotOwner() public {
        vm.expectRevert(
            abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", address(this))
        );

        ticketSale.setTimeSettings(block.timestamp, block.timestamp);
    }

    function test_setTimeSettings_revert_ifSalesAlreadyStarted() public {
        SaleParams memory saleParams =
            SaleParams(block.timestamp, block.timestamp + 1, PRICE, address(paymentToken));

        TicketParams memory ticketParams = TicketParams("Test", "T", BASE_URI, CAP);

        vm.prank(STREAMER);
        ticketSale.initialize(
            address(ticketImpl),
            STREAMER,
            PROTOCOL_FEE,
            PROTOCOL_FEE_RECIPIENT,
            saleParams,
            ticketParams
        );

        vm.expectRevert(TicketSale.SalesAlreadyStarted.selector);

        vm.prank(STREAMER);
        ticketSale.setTimeSettings(block.timestamp, block.timestamp);
    }

    function test_setTimeSettings_revert_ifInvalidTimeSettings() public {
        SaleParams memory saleParams =
            SaleParams(block.timestamp + 2, block.timestamp + 3, PRICE, address(paymentToken));

        TicketParams memory ticketParams = TicketParams("Test", "T", BASE_URI, CAP);

        vm.prank(STREAMER);
        ticketSale.initialize(
            address(ticketImpl),
            STREAMER,
            PROTOCOL_FEE,
            PROTOCOL_FEE_RECIPIENT,
            saleParams,
            ticketParams
        );

        vm.warp(block.timestamp + 1);

        vm.expectRevert(TicketSale.InvalidTimeSettings.selector);

        vm.prank(STREAMER);
        ticketSale.setTimeSettings(block.timestamp - 1, block.timestamp);
    }

    // endregion
}
