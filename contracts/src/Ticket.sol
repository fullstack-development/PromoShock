// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ERC721Upgradeable} from
    "@openzeppelin-upgradeable/contracts/token/ERC721/ERC721Upgradeable.sol";
import {Initializable} from "@openzeppelin-upgradeable/contracts/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin-upgradeable/contracts/access/OwnableUpgradeable.sol";

import {ITicket} from "src/interfaces/ITicket.sol";
import {IPromoFactory} from "src/interfaces/IPromoFactory.sol";
import {Promotion} from "src/Promo.sol";

struct TicketParams {
    string name;
    string symbol;
    string baseUri;
    uint16 cap;
}

/**
 * @title Ticket contract
 * @notice The contract confirms ownership of the ticket.
 * A user can burn their ticket.
 *
 * The contract is managed by Owner role.
 * The owner can change the baseTokenUri.
 *
 * @dev A new instance is created based on EIP-1167 using
 * the library https://docs.openzeppelin.com/contracts/5.x/api/proxy#Clones
 */
contract Ticket is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    uint16 public CAP;

    uint256 private _totalSupply;
    uint256 private _tokenCounter;
    address private _creator;
    string private _baseTokenURI;
    address[] private _owners;

    mapping(address owner => bool isTicketBurned) private _isTicketBurned;

    /// Events

    event BaseTokenURIChanged(string baseURI);
    event MintTicket(address indexed owner, uint256 tokenId);

    /// Errors

    error MaxCollectionSizeExceeded(uint16 cap);
    error OnlyCreatorCanBurn();
    error OnlyCreatorOrOwnerCanMint();
    error TransfersAreNotAllowed();
    error ZeroAddress();
    error ZeroCap();

    constructor() {
        _disableInitializers();
    }

    // region - Supports interface

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Upgradeable)
        returns (bool)
    {
        return interfaceId == type(ITicket).interfaceId || super.supportsInterface(interfaceId);
    }

    // endregion

    // region - Initialize

    /**
     * @notice Initializes the Ticket contract
     * @param ticket TicketParams struct containing Ticket parameters
     * @param streamer The address of the streamer
     * @dev Streamer address and number of tickets cannot be zero
     */
    function initialize(TicketParams calldata ticket, address streamer) external initializer {
        if (streamer == address(0)) {
            revert ZeroAddress();
        }
        if (ticket.cap == 0) {
            revert ZeroCap();
        }

        __ERC721_init(ticket.name, ticket.symbol);
        __Ownable_init(streamer);

        _creator = msg.sender;
        _baseTokenURI = ticket.baseUri;
        CAP = ticket.cap;
    }

    // endregion

    // region - Mint

    /**
     * @notice Mint tickets
     * @param to The address of the ticket recipient
     * @dev Only the owner or creator of the collection can mint
     */
    function safeMint(address to) external returns (uint256 tokenId) {
        if (msg.sender != _creator && msg.sender != owner()) {
            revert OnlyCreatorOrOwnerCanMint();
        }

        // If there has already been a purchase to this address,
        // do not update the owners array
        if (_isTicketBurned[to]) {
            _isTicketBurned[to] = false;
        } else {
            _owners.push(to);
        }

        _tokenCounter++;
        _totalSupply++;
        tokenId = _tokenCounter;

        if (_totalSupply > CAP) {
            revert MaxCollectionSizeExceeded(CAP);
        }

        _safeMint(to, tokenId);

        emit MintTicket(to, tokenId);
    }

    // endregion

    // region - Burn

    /**
     * @notice Burn tickets
     * @param auth The address of the ticket owner
     * @param tokenId Token ID
     * @dev Only the owner of the ticket can burn
     */
    function burn(address auth, uint256 tokenId) external {
        if (msg.sender != _creator) {
            revert OnlyCreatorCanBurn();
        }
        _totalSupply--;
        _isTicketBurned[auth] = true;

        _update(address(0), tokenId, auth);
    }

    // endregion

    // region - URI

    function tokenURI(uint256) public view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseTokenURI(string memory baseTokenURI) external onlyOwner {
        _baseTokenURI = baseTokenURI;
        emit BaseTokenURIChanged(baseTokenURI);
    }

    // endregion

    // region - Getters

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function getAllOwners() external view returns (address[] memory currentOwners) {
        address[] memory ownersForEntirePeriod = _owners;
        currentOwners = new address[](_totalSupply);

        uint256 j;
        for (uint256 i; i < ownersForEntirePeriod.length; i++) {
            address owner = ownersForEntirePeriod[i];

            // If the ticket is returned
            // and no longer purchased from this address, skip it
            if (_isTicketBurned[owner]) {
                continue;
            }

            currentOwners[j] = owner;
            j++;
        }
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
