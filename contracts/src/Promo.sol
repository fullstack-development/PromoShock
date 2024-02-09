// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ERC721URIStorageUpgradeable} from
    "@openzeppelin-upgradeable/contracts/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import {ERC721Upgradeable} from
    "@openzeppelin-upgradeable/contracts/token/ERC721/ERC721Upgradeable.sol";
import {AccessControlUpgradeable} from
    "@openzeppelin-upgradeable/contracts/access/AccessControlUpgradeable.sol";
import {Initializable} from "@openzeppelin-upgradeable/contracts/proxy/utils/Initializable.sol";

import {ITicket} from "src/interfaces/ITicket.sol";

struct Promotion {
    uint256 startTime;
    uint256 endTime;
    address promoAddr;
    address[] streams;
    string description;
}

/**
 * @title Promo contract
 * @notice The contract that creates promotions. Every promotion is a nft (ERC721).
 *
 * The contract is managed by two roles: Default admin and Minter.
 *
 * The Minter can mint tokens.
 * The Default admin can set contract URI address.
 *
 * Only the owner of the nft can change the uri token.
 */
contract Promo is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    AccessControlUpgradeable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    string private _contractURI;
    uint256 private _tokenCounter;

    mapping(uint256 tokenId => Promotion promotion) private _promotions;

    // Events

    event ContractURIChanged(string contractURI);
    event MintPromo(address indexed owner, uint256 tokenId, Promotion promotion);
    event TokenUriChanged(address indexed owner, uint256 tokenId, string tokenUri);

    // Errors

    error IncorrectStreamAddress(address stream);
    error InvalidTimeSettings();
    error NotTokenOwner();
    error ZeroAddress();

    /// Modifiers

    /// @notice Checks that the caller is the owner of tokenId
    modifier onlyTokenOwner(uint256 tokenId) {
        if (ownerOf(tokenId) != msg.sender) {
            revert NotTokenOwner();
        }

        _;
    }

    constructor() {
        _disableInitializers();
    }

    // region - supportInterface

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // endregion

    // region - Initialize

    /**
     * @notice Initializes the Promo contract
     * @param promoFactory The address of promo factory contract
     * @param contractUri The contract URI
     */
    function initialize(address promoFactory, string calldata contractUri) external initializer {
        __ERC721_init("MetaPromo", "MP");
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, promoFactory);

        _contractURI = contractUri;
    }

    // endregion

    // region - Safe Mint

    /**
     * @notice Mints a promotional token to a specified address
     * with a given URI and promotion details
     * @param to The address of the promo recipient
     * @param uri The metadata URI associated with the minted token
     * @param promotion A struct containing parameters for the promotion
     * @dev This function can only be called by an account with the MINTER_ROLE
     */
    function safeMint(address to, string calldata uri, Promotion calldata promotion)
        external
        onlyRole(MINTER_ROLE)
    {
        _tokenCounter++;
        uint256 tokenId = _tokenCounter;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        _checkPromotion(promotion);
        _promotions[tokenId] = promotion;

        emit MintPromo(to, tokenId, promotion);
    }

    function _checkPromotion(Promotion calldata promotion) private view {
        if (promotion.startTime < block.timestamp || promotion.endTime <= promotion.startTime) {
            revert InvalidTimeSettings();
        }

        if (promotion.promoAddr == address(0)) {
            revert ZeroAddress();
        }

        // Each stream address must be a smart contract
        // and support the IToken interface
        for (uint256 i; i < promotion.streams.length; i++) {
            if (
                promotion.streams[i].code.length == 0
                    || !ITicket(promotion.streams[i]).supportsInterface(type(ITicket).interfaceId)
            ) {
                revert IncorrectStreamAddress(promotion.streams[i]);
            }
        }
    }

    // endregion

    // region - URI

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function contractURI() external view returns (string memory) {
        return _contractURI;
    }

    function setTokenUri(uint256 tokenId, string memory uri) external onlyTokenOwner(tokenId) {
        _setTokenURI(tokenId, uri);
        emit TokenUriChanged(msg.sender, tokenId, uri);
    }

    function setContractURI(string memory newContractURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _contractURI = newContractURI;
        emit ContractURIChanged(newContractURI);
    }

    // endregion

    // region - Getters

    function totalSupply() external view returns (uint256) {
        return _tokenCounter;
    }

    function getPromotion(uint256 tokenId) external view returns (Promotion memory) {
        return _promotions[tokenId];
    }

    function getTicketsAmount(uint256 tokenId) external view returns (uint256 totalTicketsAmount) {
        Promotion memory promotion = _promotions[tokenId];
        uint256 streamAmount = promotion.streams.length;

        for (uint256 i; i < streamAmount; i++) {
            totalTicketsAmount += ITicket(promotion.streams[i]).totalSupply();
        }
    }

    // endregion
}
