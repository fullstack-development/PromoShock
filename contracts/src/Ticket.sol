// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Initializable} from "@openzeppelin-upgradeable/contracts/proxy/utils/Initializable.sol";
import {ERC721Upgradeable} from
    "@openzeppelin-upgradeable/contracts/token/ERC721/ERC721Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin-upgradeable/contracts/access/OwnableUpgradeable.sol";

import {IPromoFactory} from "src/interfaces/IPromoFactory.sol";
import {Promotion} from "src/Promo.sol";

struct TicketParams {
    string name;
    string symbol;
    string baseUri;
    string contractUri;
    uint16 cap;
}

contract Ticket is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    uint16 public CAP;

    string private _baseTokenURI;
    string private _contractURI;
    uint256 private _tokenCounter;
    uint256 private _totalSupply;
    address private _creator;
    address[] private _owners;

    event MintNft(address indexed owner, uint256 indexed tokenId);
    event BaseTokenURIChanged(string baseURI);
    event ContractURIChanged(string contractURI);

    error ZeroAddress();
    error ZeroCap();
    error TransfersAreNotAllowed();
    error MaxCollectionSizeExceeded(uint16 cap);
    error OnlyCreatorOrOwnerCanMint();

    constructor() {
        _disableInitializers();
    }

    // region - Initialize

    function initialize(TicketParams calldata ticket, address streamer) external initializer {
        if (streamer == address(0)) revert ZeroAddress();
        if (ticket.cap == 0) revert ZeroCap();

        __ERC721_init(ticket.name, ticket.symbol);
        __Ownable_init(streamer);

        _creator = msg.sender;
        _contractURI = ticket.contractUri;
        _baseTokenURI = ticket.baseUri;
        CAP = ticket.cap;
    }

    // endregion

    // region - Mint

    function safeMint(address to) external returns (uint256 tokenId) {
        if (msg.sender != _creator && msg.sender != owner()) {
            revert OnlyCreatorOrOwnerCanMint();
        }

        _tokenCounter++;
        _totalSupply++;
        tokenId = _tokenCounter;

        if (_totalSupply > CAP) {
            revert MaxCollectionSizeExceeded(CAP);
        }

        _safeMint(to, tokenId);
        _owners.push(to);

        emit MintNft(to, tokenId);
    }

    // endregion

    // region - Burn

    function burn(address auth, uint256 tokenId) public virtual {
        _totalSupply--;

        _update(address(0), tokenId, auth);
    }

    // endregion

    // region - URI

    function tokenURI(uint256) public view override returns (string memory) {
        return _baseTokenURI;
    }

    function contractURI() external view returns (string memory) {
        return _contractURI;
    }

    function setBaseTokenURI(string memory baseTokenURI) external onlyOwner {
        _baseTokenURI = baseTokenURI;
        emit BaseTokenURIChanged(baseTokenURI);
    }

    function setContractURI(string memory newContractURI) external onlyOwner {
        _contractURI = newContractURI;
        emit ContractURIChanged(newContractURI);
    }

    // endregion

    // region - Getters

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function getAllOwners() external view returns (address[] memory) {
        return _owners;
    }

    function getAvailablePromotions(address promoFactory)
        external
        view
        returns (Promotion[] memory)
    {
        return IPromoFactory(promoFactory).getAvailablePromotions(address(this));
    }

    // endregion

    // region - Private functions

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert TransfersAreNotAllowed();
        }

        return super._update(to, tokenId, auth);
    }

    // endregion
}
