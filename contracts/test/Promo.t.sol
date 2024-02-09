// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";

import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import {TransparentProxy} from "src/proxy/TransparentProxy.sol";
import {Promo, Promotion} from "src/Promo.sol";
import {TicketFactory} from "src/TicketFactory.sol";
import {TicketSale, SaleParams} from "src/TicketSale.sol";
import {Ticket, TicketParams} from "src/Ticket.sol";

contract PromoTest is Test {
    Promo promoImplementation;
    TicketFactory factoryImplementation;
    TransparentProxy promoProxy;
    TransparentProxy factoryProxy;

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

    bytes32 constant DEFAULT_ADMIN_ROLE = 0x00;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    address MARKETER;
    address STREAMER;
    address ALICE;
    address BOB;
    address PROTOCOL_FEE_RECIPIENT;

    function setUp() public {
        MARKETER = makeAddr("MARKETER");
        STREAMER = makeAddr("STREAMER");
        ALICE = makeAddr("ALICE");
        BOB = makeAddr("BOB");
        PROTOCOL_FEE_RECIPIENT = makeAddr("PROTOCOL_FEE_RECIPIENT");

        saleImpl = new TicketSale();
        ticketImpl = new Ticket();

        factoryImplementation = new TicketFactory();
        bytes memory factoryData = abi.encodeWithSignature(
            "initialize(address,address,address,uint256,uint256)",
            address(saleImpl),
            address(ticketImpl),
            PROTOCOL_FEE_RECIPIENT,
            PROTOCOL_FEE,
            MAX_SALE_PERIOD
        );

        factoryProxy =
            new TransparentProxy(address(factoryImplementation), address(this), factoryData);

        factory = TicketFactory(address(factoryProxy));

        paymentToken = new ERC20Mock();

        promoImplementation = new Promo();
        bytes memory promoData =
            abi.encodeWithSignature("initialize(address,string)", address(factory), CONTRACT_URI);

        promoProxy = new TransparentProxy(address(promoImplementation), address(this), promoData);

        promo = Promo(address(promoProxy));
    }

    // region - initialize

    function test_initialize() public {
        assertTrue(promo.hasRole(DEFAULT_ADMIN_ROLE, address(this)));
        assertTrue(promo.hasRole(MINTER_ROLE, address(factory)));
    }

    // endregion

    // region - supportsInterface

    function test_supportsInterface() public {
        assertTrue(promo.supportsInterface(type(IERC721).interfaceId));
    }

    // endregion

    // region - safeMint

    function _beforeMint() private returns (Promotion memory promotion) {
        TicketParams memory ticket = TicketParams("Test", "T", BASE_URI, CAP);
        SaleParams memory sale =
            SaleParams(block.timestamp, block.timestamp + 1, 1 ether, address(paymentToken));

        vm.prank(STREAMER);
        (, address ticketAddr) = factory.createTicketSale(sale, ticket);

        address[] memory streams = new address[](1);
        streams[0] = ticketAddr;

        promotion = Promotion(
            block.timestamp, block.timestamp + 1, address(promo), streams, "MetaLamp development"
        );
    }

    function test_safeMint() public {
        Promotion memory promotion = _beforeMint();

        vm.prank(address(factory));
        promo.safeMint(MARKETER, TOKEN_URI, promotion);

        assertEq(promo.balanceOf(MARKETER), 1);
        assertEq(promo.ownerOf(TOKEN_ID), MARKETER);
        assertEq(promo.totalSupply(), 1);
    }

    function test_safeMint_revert_ifInvalidTimeSettings() public {
        Promotion memory promotion = _beforeMint();

        // Case 1. endTime == startTime (2 == 2)
        promotion.startTime += 1;
        vm.expectRevert(Promo.InvalidTimeSettings.selector);
        vm.prank(address(factory));
        promo.safeMint(MARKETER, TOKEN_URI, promotion);

        // Case 2. endTime < startTime (1 < 2)
        promotion.endTime -= 1;
        vm.expectRevert(Promo.InvalidTimeSettings.selector);
        vm.prank(address(factory));
        promo.safeMint(MARKETER, TOKEN_URI, promotion);

        // Case 3. startTime < block.timestamp (1 < 2)
        vm.warp(block.timestamp + 1);
        vm.expectRevert(Promo.InvalidTimeSettings.selector);
        vm.prank(address(factory));
        promo.safeMint(MARKETER, TOKEN_URI, promotion);
    }

    function test_safeMint_revert_ifZeroAddress() public {
        Promotion memory promotion = _beforeMint();

        promotion.promoAddr = address(0);
        vm.expectRevert(Promo.ZeroAddress.selector);
        vm.prank(address(factory));
        promo.safeMint(MARKETER, TOKEN_URI, promotion);
    }

    function test_safeMint_revert_ifIncorrectStreamAddress() public {
        Promotion memory promotion = _beforeMint();

        address[] memory newStreams = new address[](2);
        newStreams[0] = promotion.streams[0];
        newStreams[1] = makeAddr("zeroCodeAddress");

        promotion.streams = newStreams;

        vm.expectRevert(
            abi.encodeWithSelector(Promo.IncorrectStreamAddress.selector, newStreams[1])
        );

        vm.prank(address(factory));
        promo.safeMint(MARKETER, TOKEN_URI, promotion);
    }

    // endregion

    // region - tokenURI

    function test_tokenUri() public {
        Promotion memory promotion = _beforeMint();
        vm.prank(address(factory));
        promo.safeMint(MARKETER, TOKEN_URI, promotion);

        assertEq(promo.tokenURI(TOKEN_ID), TOKEN_URI);
    }

    function test_setTokenUri() public {
        Promotion memory promotion = _beforeMint();
        vm.prank(address(factory));
        promo.safeMint(MARKETER, TOKEN_URI, promotion);

        string memory newTokenUri = "ipfs://newTokenUri";

        vm.prank(MARKETER);
        promo.setTokenUri(TOKEN_ID, newTokenUri);

        assertEq(promo.tokenURI(TOKEN_ID), newTokenUri);
    }

    function test_setTokenUri_revert_ifNotTokenOwner() public {
        Promotion memory promotion = _beforeMint();
        vm.prank(address(factory));
        promo.safeMint(MARKETER, TOKEN_URI, promotion);

        string memory newTokenUri = "ipfs://newTokenUri";

        vm.expectRevert(Promo.NotTokenOwner.selector);

        promo.setTokenUri(TOKEN_ID, newTokenUri);
    }

    // endregion

    // region - contractUri

    function test_contractUri() public {
        Promotion memory promotion = _beforeMint();
        vm.prank(address(factory));
        promo.safeMint(MARKETER, TOKEN_URI, promotion);

        assertEq(promo.contractURI(), CONTRACT_URI);
    }

    function test_setContractUri() public {
        Promotion memory promotion = _beforeMint();
        vm.prank(address(factory));
        promo.safeMint(MARKETER, TOKEN_URI, promotion);

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

        TicketParams memory ticket = TicketParams("Test", "T", BASE_URI, CAP);

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

        Promotion memory promotion = Promotion(
            block.timestamp, block.timestamp + 1, address(promo), streams, "MetaLamp development"
        );

        vm.prank(address(factory));
        promo.safeMint(MARKETER, TOKEN_URI, promotion);

        Promotion memory promoCompanyAfter = promo.getPromotion(TOKEN_ID);

        assertEq(promoCompanyAfter.startTime, promoCompanyAfter.startTime);
        assertEq(promoCompanyAfter.endTime, promoCompanyAfter.endTime);
        assertEq(promoCompanyAfter.streams.length, promoCompanyAfter.streams.length);
        assertEq(promoCompanyAfter.description, promoCompanyAfter.description);
    }

    function test_promo_getTicketsAmount() public {
        address[] memory streams = _beforePromoCompany();

        uint256 ticketsAmount = Ticket(streams[0]).totalSupply();
        uint256 ticketsAmount2 = Ticket(streams[1]).totalSupply();

        Promotion memory promotion = Promotion(
            block.timestamp, block.timestamp + 1, address(promo), streams, "MetaLamp development"
        );

        vm.prank(address(factory));
        promo.safeMint(MARKETER, TOKEN_URI, promotion);

        uint256 totalTicketsAmount = promo.getTicketsAmount(TOKEN_ID);
        assertEq(totalTicketsAmount, ticketsAmount + ticketsAmount2);
    }

    // endregion
}
