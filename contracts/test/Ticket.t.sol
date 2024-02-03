// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

import {Ticket, TicketParams} from "src/Ticket.sol";
import {Promotion, Promo} from "src/Promo.sol";
import {PromoFactory} from "src/PromoFactory.sol";

contract TicketTest is Test {
    Ticket ticket;

    uint16 constant CAP = 100;
    uint256 constant TOKEN_ID = 1;
    string constant BASE_URI = "ipfs://testTokenUri/";
    string constant CONTRACT_URI = "ipfs://testContractUri";
    address ALICE;
    address BOB;

    function setUp() external {
        Ticket implementation = new Ticket();
        ticket = Ticket(Clones.clone(address(implementation)));

        ALICE = makeAddr("ALICE");
        BOB = makeAddr("BOB");
    }

    // region - Initialize

    function test_initialize() public {
        TicketParams memory ticketParams = TicketParams("Test", "T", BASE_URI, CONTRACT_URI, CAP);
        ticket.initialize(ticketParams, address(this));

        assertEq(ticket.name(), "Test");
        assertEq(ticket.symbol(), "T");
        assertEq(ticket.contractURI(), CONTRACT_URI);
        assertEq(ticket.owner(), address(this));
        assertEq(ticket.CAP(), CAP);
    }

    function test_initialize_revert_ifZeroAddress() public {
        TicketParams memory ticketParams = TicketParams("Test", "T", BASE_URI, CONTRACT_URI, CAP);

        vm.expectRevert(Ticket.ZeroAddress.selector);

        ticket.initialize(ticketParams, address(0));
    }

    // endregion

    // region - safeMint

    function _beforeMint() private {
        TicketParams memory ticketParams = TicketParams("Test", "T", BASE_URI, CONTRACT_URI, CAP);
        ticket.initialize(ticketParams, address(this));
    }

    function test_mint() public {
        _beforeMint();

        ticket.safeMint(ALICE);
        ticket.safeMint(BOB);

        address[] memory arr = new address[](2);
        arr[0] = ALICE;
        arr[1] = BOB;

        assertEq(ticket.ownerOf(TOKEN_ID), ALICE);
        assertEq(ticket.ownerOf(TOKEN_ID + 1), BOB);
        assertEq(ticket.totalSupply(), 2);
        assertEq(ticket.getAllOwners(), arr);
    }

    // endregion

    // region - Cap

    function test_cap() public {
        uint16 cap = 1;

        TicketParams memory ticketParams = TicketParams("Test", "T", BASE_URI, CONTRACT_URI, cap);
        ticket.initialize(ticketParams, address(this));

        ticket.safeMint(ALICE);

        vm.expectRevert(abi.encodeWithSelector(Ticket.MaxCollectionSizeExceeded.selector, cap));

        ticket.safeMint(BOB);
    }

    // endregion

    // region - Transfers

    function test_transfer_not_allowed() public {
        _beforeMint();

        ticket.safeMint(ALICE);

        vm.expectRevert(Ticket.TransfersAreNotAllowed.selector);

        vm.prank(ALICE);
        ticket.transferFrom(ALICE, BOB, TOKEN_ID);
    }

    // endregion

    // region - URI

    function test_contractUri() public {
        _beforeMint();

        assertEq(ticket.contractURI(), CONTRACT_URI);
    }

    function test_setContractUri() public {
        _beforeMint();

        assertEq(ticket.contractURI(), CONTRACT_URI);

        string memory newContractUri = "ipfs://newContractUri";

        ticket.setContractURI(newContractUri);

        assertEq(ticket.contractURI(), newContractUri);
    }

    function test_tokenUri() public {
        _beforeMint();

        ticket.safeMint(ALICE);

        assertEq(ticket.tokenURI(TOKEN_ID), string.concat(BASE_URI, "1"));
    }

    function test_setBaseTokenUri() public {
        test_tokenUri();

        string memory newBaseUri = "ipfs://newBaseUri/";
        ticket.setBaseTokenURI(newBaseUri);

        assertEq(ticket.tokenURI(TOKEN_ID), string.concat(newBaseUri, "1"));
    }

    // endregion

    // region - getAvailablePromotions

    function test_getAvailablePromotions() public {
        address[] memory streams = new address[](1);
        streams[0] = address(ticket);

        address marketer = makeAddr("marketer");
        address recipient = makeAddr("recipient");

        ERC20Mock paymentToken = new ERC20Mock();
        paymentToken.mint(marketer, 1 ether);

        PromoFactory factory = new PromoFactory(address(paymentToken), recipient, 1 ether);

        Promo promo = new Promo(address(factory), CONTRACT_URI);

        Promotion memory promotion = Promotion(
            block.timestamp, block.timestamp + 1, address(promo), streams, "MetaLamp development"
        );

        vm.startPrank(marketer);
        paymentToken.approve(address(factory), 1 ether);
        factory.createPromo(promotion, "tokenUri");
        vm.stopPrank();

        Promotion[] memory promotions = ticket.getAvailablePromotions(address(factory));

        assertEq(promotions[0].promoAddr, address(promo));
    }

    // endregion
}
