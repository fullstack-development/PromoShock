// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ERC721URIStorage} from
    "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {ITicket} from "src/interfaces/ITicket.sol";

struct PromoCompany {
    uint256 startTime;
    uint256 endTime;
    address[] streams;
    string description;
}

contract Promo is ERC721, ERC721URIStorage, Ownable {
    string private _contractURI;
    uint256 private _tokenCounter;

    mapping(uint256 tokenId => PromoCompany promo) private _promoCompanies;

    event MintPromo(address indexed owner, uint256 indexed tokenId, PromoCompany promo);
    event ContractURIChanged(string contractURI);
    event TokenUriChanged(address indexed owner, uint256 indexed tokenId, string tokenUri);

    error NotTokenOwner();

    constructor(address promoFactory, string memory contractUri) ERC721("MetaPromo", "MP") Ownable(promoFactory) {
        _contractURI = contractUri;
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        if (ownerOf(tokenId) != msg.sender) {
            revert NotTokenOwner();
        }

        _;
    }

    // region - supportInterface

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // endregion

    // region - Safe Mint

    function safeMint(address to, string calldata uri, PromoCompany calldata promo)
        external
        onlyOwner
    {
        _tokenCounter++;
        uint256 tokenId = _tokenCounter;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _promoCompanies[tokenId] = promo;

        emit MintPromo(to, tokenId, promo);
    }

    // endregion

    // region - URI

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
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

    function getPromoCompany(uint256 tokenId) external view returns (PromoCompany memory) {
        return _promoCompanies[tokenId];
    }

    function getTicketsAmount(uint256 tokenId)
        external
        view
        returns (uint256 totalTicketsAmount)
    {
        PromoCompany memory promo = _promoCompanies[tokenId];
        uint256 streamAmount = promo.streams.length;

        for (uint256 i; i < streamAmount; i++) {
            totalTicketsAmount += ITicket(promo.streams[i]).totalSupply();
        }
    }

    // endregion
}
