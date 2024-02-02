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
    string constant BASE_URI = "ipfs://testTokenUri/";
    string constant CONTRACT_URI = "ipfs://testContractUri";
    address STREAMER;
    address ALICE;
    address BOB;

    function setUp() external {
        TicketSale ticketSaleImpl = new TicketSale();
        ticketSale = TicketSale(Clones.clone(address(ticketSaleImpl)));

        ticketImpl = new Ticket();

        paymentToken = new ERC20Mock();

        STREAMER = makeAddr("STREAMER");
        ALICE = makeAddr("ALICE");
        BOB = makeAddr("BOB");
    }

    // region - Initialize

    function test_initialize() public {
        SaleParams memory saleParams =
            SaleParams(block.timestamp, block.timestamp + 1, 1 ether, address(paymentToken));

        TicketParams memory ticketParams = TicketParams("Test", "T", BASE_URI, CONTRACT_URI, CAP);

        address ticketAddr =
            ticketSale.initialize(address(ticketImpl), STREAMER, saleParams, ticketParams);
        Ticket ticket = Ticket(ticketAddr);

        assertEq(ticket.name(), "Test");
        assertEq(ticket.symbol(), "T");
        assertEq(ticket.contractURI(), CONTRACT_URI);
        assertEq(ticket.owner(), address(ticketSale));
        assertEq(ticket.CAP(), CAP);

        assertEq(ticketSale.owner(), STREAMER);

        SaleParams memory sale = ticketSale.getSaleParams();
        assertEq(sale.startTime, block.timestamp);
        assertEq(sale.endTime, block.timestamp + 1);
        assertEq(sale.rate, 1 ether);
        assertEq(sale.paymentToken, address(paymentToken));
    }

    // endregion
}
