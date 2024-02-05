// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";
import {TransparentUpgradeableProxy} from
    "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

import {Promo, Promotion} from "src/Promo.sol";
import {PromoFactory} from "src/PromoFactory.sol";

contract PromoFactoryTest is Test {
    ProxyAdmin admin;
    Promo promoImplementation;
    PromoFactory promoFactoryImpl;
    TransparentUpgradeableProxy promoProxy;
    TransparentUpgradeableProxy promoFactoryProxy;

    Promo promo;
    PromoFactory factory;
    ERC20Mock paymentToken;

    uint256 constant PRICE = 50e18; // 50 USDT
    uint256 constant TOKEN_ID = 1;
    string constant TOKEN_URI = "ipfs://testTokenUri/";
    string constant CONTRACT_URI = "ipfs://testContractUri";
    address MARKETER;
    address RECIPIENT;

    function setUp() public {
        MARKETER = makeAddr("MARKETER");
        RECIPIENT = makeAddr("RECIPIENT");

        paymentToken = new ERC20Mock();

        admin = new ProxyAdmin(address(this));

        promoFactoryImpl = new PromoFactory();
        bytes memory promoFactoryData = abi.encodeWithSignature(
            "initialize(address,address,uint256)", address(paymentToken), RECIPIENT, PRICE
        );

        promoFactoryProxy = new TransparentUpgradeableProxy(
            address(promoFactoryImpl),
            address(admin),
            promoFactoryData
        );

        factory = PromoFactory(address(promoFactoryProxy));

        promoImplementation = new Promo();
        bytes memory promoData =
            abi.encodeWithSignature("initialize(address,string)", address(factory), CONTRACT_URI);

        promoProxy = new TransparentUpgradeableProxy(
            address(promoImplementation),
            address(admin),
            promoData
        );

        promo = Promo(address(promoProxy));

        paymentToken.mint(MARKETER, 100 ether);
    }

    // region - Initialize

    function test_initialize() public {
        assertEq(factory.getPaymentTokenAddress(), address(paymentToken));
        assertEq(factory.getPaymentRecipientAddress(), RECIPIENT);
        assertEq(factory.getPromoCreationPrice(), PRICE);
    }

    // endregion

    // region - createPromo

    function test_createPromo() public {
        address[] memory streams = new address[](2);
        streams[0] = makeAddr("stream");
        streams[1] = makeAddr("stream1");

        Promotion memory promotion = Promotion(
            block.timestamp, block.timestamp + 1, address(promo), streams, "MetaLamp development"
        );

        vm.startPrank(MARKETER);
        paymentToken.approve(address(factory), PRICE * 2);
        factory.createPromo(promotion, TOKEN_URI);
        vm.stopPrank();

        assertEq(promo.balanceOf(MARKETER), 1);
        assertEq(promo.ownerOf(TOKEN_ID), MARKETER);
        assertEq(paymentToken.balanceOf(RECIPIENT), PRICE * 2);

        Promotion[] memory promotions = factory.getAvailablePromotions(address(streams[0]));
        assertEq(promotions.length, 1);
        assertEq(promotions[0].startTime, block.timestamp);
        assertEq(promotions[0].endTime, block.timestamp + 1);
        assertEq(promotions[0].promoAddr, address(promo));
        assertEq(promotions[0].streams[0], streams[0]);
        assertEq(promotions[0].description, "MetaLamp development");
    }

    // endregion

    // region - Setters

    function test_setPromoCreationPrice() public {
        assertEq(factory.getPromoCreationPrice(), PRICE);

        uint256 newPrice = 2 ether;
        factory.setPromoCreationPrice(newPrice);

        assertEq(factory.getPromoCreationPrice(), newPrice);
    }

    function test_setPaymentTokenAddress() public {
        assertEq(factory.getPaymentTokenAddress(), address(paymentToken));

        address newPaymentToken = makeAddr("newPaymentToken");
        factory.setPaymentToken(newPaymentToken);

        assertEq(factory.getPaymentTokenAddress(), newPaymentToken);
    }

    function test_setPaymentRecipientAddress() public {
        assertEq(factory.getPaymentRecipientAddress(), RECIPIENT);

        address newRecipient = makeAddr("newRecipient");
        factory.setPaymentRecipient(newRecipient);

        assertEq(factory.getPaymentRecipientAddress(), newRecipient);
    }

    // endregion
}
