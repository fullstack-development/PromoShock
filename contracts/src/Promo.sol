// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ERC721URIStorageUpgradeable} from
    "@openzeppelin-upgradeable/contracts/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import {ERC721Upgradeable} from
    "@openzeppelin-upgradeable/contracts/token/ERC721/ERC721Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin-upgradeable/contracts/access/OwnableUpgradeable.sol";
import {Initializable} from "@openzeppelin-upgradeable/contracts/proxy/utils/Initializable.sol";

import {ITicket} from "src/interfaces/ITicket.sol";

struct Promotion {
    uint256 startTime;
    uint256 endTime;
    address promoAddr;
    address[] streams;
    string description;
}

contract Promo is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable
{
    string private _contractURI;
    uint256 private _tokenCounter;

    mapping(uint256 tokenId => Promotion promotion) private _promotions;

    event MintPromo(address indexed owner, uint256 indexed tokenId, Promotion promotion);
    event ContractURIChanged(string contractURI);
    event TokenUriChanged(address indexed owner, uint256 indexed tokenId, string tokenUri);

    error NotTokenOwner();

    constructor() {
        _disableInitializers();
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        if (ownerOf(tokenId) != msg.sender) {
            revert NotTokenOwner();
        }

        _;
    }

    function initialize(address promoFactory, string memory contractUri) external initializer {
        __ERC721_init("MetaPromo", "MP");
        __Ownable_init(promoFactory);

        _contractURI = contractUri;
    }

    // region - supportInterface

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // endregion

    // region - Safe Mint

    function safeMint(address to, string calldata uri, Promotion calldata promotion)
        external
        onlyOwner
    {
        _tokenCounter++;
        uint256 tokenId = _tokenCounter;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _promotions[tokenId] = promotion;

        emit MintPromo(to, tokenId, promotion);
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

    function setContractURI(string memory newContractURI) external onlyOwner {
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
