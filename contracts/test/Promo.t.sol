// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";

import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import {Promo, PromoCompany} from "src/Promo.sol";
import {TicketFactory} from "src/TicketFactory.sol";
import {TicketSale, SaleParams} from "src/TicketSale.sol";
import {Ticket, TicketParams} from "src/Ticket.sol";

contract PromoTest is Test {
    Promo promo;
    TicketFactory factory;
    TicketSale saleImpl;
    Ticket ticketImpl;
    ERC20Mock paymentToken;

    uint16 constant CAP = 1000;
    uint256 constant TOKEN_ID = 1;
    uint256 constant MAX_SALE_PERIOD = 30 days;
    uint256 constant PROTOCOL_FEE = 100;
    string constant BASE_URI = "ipfs://testBaseUri/";
    string constant TOKEN_URI = "ipfs://testTokenUri/";
    string constant CONTRACT_URI = "ipfs://testContractUri";
    address MARKETER;
    address STREAMER;
    address ALICE;
    address BOB;

    function setUp() public {
        saleImpl = new TicketSale();
        ticketImpl = new Ticket();

        factory =
            new TicketFactory(address(saleImpl), address(ticketImpl), MAX_SALE_PERIOD, PROTOCOL_FEE);

        paymentToken = new ERC20Mock();

        promo = new Promo(address(this), CONTRACT_URI);

        MARKETER = makeAddr("MARKETER");
        STREAMER = makeAddr("STREAMER");
        ALICE = makeAddr("ALICE");
        BOB = makeAddr("BOB");
    }

    // region - supportsInterface

    function test_supportsInterface() public {
        assertTrue(promo.supportsInterface(type(IERC721).interfaceId));
    }

    // endregion

    // region - safeMint

    function _beforeMint() private returns (PromoCompany memory promoCompany) {
        SaleParams memory sale =
            SaleParams(block.timestamp, block.timestamp + 1, 1 ether, address(paymentToken));

        TicketParams memory ticket = TicketParams("Test", "T", BASE_URI, CONTRACT_URI, CAP);

        vm.prank(STREAMER);
        (, address ticketAddr) = factory.createTicketSale(sale, ticket);

        address[] memory streams = new address[](1);
        streams[0] = ticketAddr;

        promoCompany = PromoCompany(block.timestamp, block.timestamp + 1, streams, "Promo Company");
    }

    function test_safeMint() public {
        PromoCompany memory promoCompany = _beforeMint();

        promo.safeMint(MARKETER, TOKEN_URI, promoCompany);

        assertEq(promo.balanceOf(MARKETER), 1);
        assertEq(promo.ownerOf(TOKEN_ID), MARKETER);
        assertEq(promo.totalSupply(), 1);
    }

    // endregion

    // region - tokenURI

    function test_tokenUri() public {
        PromoCompany memory promoCompany = _beforeMint();
        promo.safeMint(MARKETER, TOKEN_URI, promoCompany);

        assertEq(promo.tokenURI(TOKEN_ID), TOKEN_URI);
    }

    function test_setTokenUri() public {
        PromoCompany memory promoCompany = _beforeMint();
        promo.safeMint(MARKETER, TOKEN_URI, promoCompany);

        string memory newTokenUri = "ipfs://newTokenUri";

        vm.prank(MARKETER);
        promo.setTokenUri(TOKEN_ID, newTokenUri);

        assertEq(promo.tokenURI(TOKEN_ID), newTokenUri);
    }

    function test_setTokenUri_revert_ifNotTokenOwner() public {
        PromoCompany memory promoCompany = _beforeMint();
        promo.safeMint(MARKETER, TOKEN_URI, promoCompany);

        string memory newTokenUri = "ipfs://newTokenUri";

        vm.expectRevert(Promo.NotTokenOwner.selector);

        promo.setTokenUri(TOKEN_ID, newTokenUri);
    }

    // endregion

    // region - contractUri

    function test_contractUri() public {
        PromoCompany memory promoCompany = _beforeMint();
        promo.safeMint(MARKETER, TOKEN_URI, promoCompany);

        assertEq(promo.contractURI(), CONTRACT_URI);
    }

    function test_setContractUri() public {
        PromoCompany memory promoCompany = _beforeMint();
        promo.safeMint(MARKETER, TOKEN_URI, promoCompany);

        assertEq(promo.contractURI(), CONTRACT_URI);

        string memory newContractUri = "ipfs://newContractUri";
        promo.setContractURI(newContractUri);

        assertEq(promo.contractURI(), newContractUri);
    }

    // endregion

    // region - Promo company

    function _beforePromoCompany() private returns (address[] memory streams) {
        SaleParams memory sale =
            SaleParams(block.timestamp, block.timestamp + 1, 1 ether, address(paymentToken));

        TicketParams memory ticket = TicketParams("Test", "T", BASE_URI, CONTRACT_URI, CAP);

        vm.prank(STREAMER);
        (address ticketSaleAddr, address ticketAddr) = factory.createTicketSale(sale, ticket);

        uint256 ticketsAmount = 50;

        for (uint256 i; i < ticketsAmount; i++) {
            vm.prank(ticketSaleAddr);
            Ticket(ticketAddr).safeMint(ALICE);
        }

        vm.prank(STREAMER);
        (address ticketSaleAddr2, address ticketAddr2) = factory.createTicketSale(sale, ticket);

        uint256 ticketsAmount2 = 100;

        for (uint256 i; i < ticketsAmount2; i++) {
            vm.prank(ticketSaleAddr2);
            Ticket(ticketAddr2).safeMint(BOB);
        }

        streams = new address[](2);
        streams[0] = ticketAddr;
        streams[1] = ticketAddr2;
    }

    function test_promo_getPromoCompany() public {
        address[] memory streams = _beforePromoCompany();

        PromoCompany memory promoCompany =
            PromoCompany(block.timestamp, block.timestamp + 1, streams, "Promo Company");

        promo.safeMint(MARKETER, TOKEN_URI, promoCompany);

        PromoCompany memory promoCompanyAfter = promo.getPromoCompany(TOKEN_ID);

        assertEq(promoCompanyAfter.startTime, promoCompanyAfter.startTime);
        assertEq(promoCompanyAfter.endTime, promoCompanyAfter.endTime);
        assertEq(promoCompanyAfter.streams.length, promoCompanyAfter.streams.length);
        assertEq(promoCompanyAfter.description, promoCompanyAfter.description);
    }

    function test_promo_getTicketsAmount() public {
        address[] memory streams = _beforePromoCompany();

        uint256 ticketsAmount = Ticket(streams[0]).totalSupply();
        uint256 ticketsAmount2 = Ticket(streams[1]).totalSupply();

        PromoCompany memory promoCompany =
            PromoCompany(block.timestamp, block.timestamp + 1, streams, "Promo Company");

        promo.safeMint(MARKETER, TOKEN_URI, promoCompany);

        uint256 totalTicketsAmount = promo.getTicketsAmount(TOKEN_ID);
        assertEq(totalTicketsAmount, ticketsAmount + ticketsAmount2);
    }

    // endregion
}
