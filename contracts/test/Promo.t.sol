// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";

import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {TransparentUpgradeableProxy} from
    "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

import {Promo, Promotion} from "src/Promo.sol";
import {TicketFactory} from "src/TicketFactory.sol";
import {TicketSale, SaleParams} from "src/TicketSale.sol";
import {Ticket, TicketParams} from "src/Ticket.sol";

contract PromoTest is Test {
    ProxyAdmin admin;
    Promo promoImplementation;
    TicketFactory factoryImplementation;
    TransparentUpgradeableProxy promoProxy;
    TransparentUpgradeableProxy factoryProxy;

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
    address PROTOCOL_FEE_RECIPIENT;

    function setUp() public {
        MARKETER = makeAddr("MARKETER");
        STREAMER = makeAddr("STREAMER");
        ALICE = makeAddr("ALICE");
        BOB = makeAddr("BOB");
        PROTOCOL_FEE_RECIPIENT = makeAddr("PROTOCOL_FEE_RECIPIENT");

        saleImpl = new TicketSale();
        ticketImpl = new Ticket();

        admin = new ProxyAdmin(address(this));

        factoryImplementation = new TicketFactory();
        bytes memory factoryData = abi.encodeWithSignature(
            "initialize(address,address,address,uint256,uint256)",
            address(saleImpl),
            address(ticketImpl),
            PROTOCOL_FEE_RECIPIENT,
            PROTOCOL_FEE,
            MAX_SALE_PERIOD
        );

        factoryProxy = new TransparentUpgradeableProxy(
            address(factoryImplementation),
            address(admin),
            factoryData
        );

        factory = TicketFactory(address(factoryProxy));

        paymentToken = new ERC20Mock();

        promoImplementation = new Promo();
        bytes memory promoData =
            abi.encodeWithSignature("initialize(address,string)", address(this), CONTRACT_URI);

        promoProxy = new TransparentUpgradeableProxy(
            address(promoImplementation),
            address(admin),
            promoData
        );

        promo = Promo(address(promoProxy));
    }

    // region - supportsInterface

    function test_supportsInterface() public {
        assertTrue(promo.supportsInterface(type(IERC721).interfaceId));
    }

    // endregion

    // region - safeMint

    function _beforeMint() private returns (Promotion memory promotion) {
        TicketParams memory ticket = TicketParams("Test", "T", BASE_URI, CONTRACT_URI, CAP);
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

        promo.safeMint(MARKETER, TOKEN_URI, promotion);

        assertEq(promo.balanceOf(MARKETER), 1);
        assertEq(promo.ownerOf(TOKEN_ID), MARKETER);
        assertEq(promo.totalSupply(), 1);
    }

    // endregion

    // region - tokenURI

    function test_tokenUri() public {
        Promotion memory promotion = _beforeMint();
        promo.safeMint(MARKETER, TOKEN_URI, promotion);

        assertEq(promo.tokenURI(TOKEN_ID), TOKEN_URI);
    }

    function test_setTokenUri() public {
        Promotion memory promotion = _beforeMint();
        promo.safeMint(MARKETER, TOKEN_URI, promotion);

        string memory newTokenUri = "ipfs://newTokenUri";

        vm.prank(MARKETER);
        promo.setTokenUri(TOKEN_ID, newTokenUri);

        assertEq(promo.tokenURI(TOKEN_ID), newTokenUri);
    }

    function test_setTokenUri_revert_ifNotTokenOwner() public {
        Promotion memory promotion = _beforeMint();
        promo.safeMint(MARKETER, TOKEN_URI, promotion);

        string memory newTokenUri = "ipfs://newTokenUri";

        vm.expectRevert(Promo.NotTokenOwner.selector);

        promo.setTokenUri(TOKEN_ID, newTokenUri);
    }

    // endregion

    // region - contractUri

    function test_contractUri() public {
        Promotion memory promotion = _beforeMint();
        promo.safeMint(MARKETER, TOKEN_URI, promotion);

        assertEq(promo.contractURI(), CONTRACT_URI);
    }

    function test_setContractUri() public {
        Promotion memory promotion = _beforeMint();
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

        Promotion memory promotion = Promotion(
            block.timestamp, block.timestamp + 1, address(promo), streams, "MetaLamp development"
        );

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

        promo.safeMint(MARKETER, TOKEN_URI, promotion);

        uint256 totalTicketsAmount = promo.getTicketsAmount(TOKEN_ID);
        assertEq(totalTicketsAmount, ticketsAmount + ticketsAmount2);
    }

    // endregion
}
