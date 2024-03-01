import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen';

import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from 'wagmi/codegen';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PromoFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const promoFactoryAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [
      {
        name: 'promotion',
        internalType: 'struct Promotion',
        type: 'tuple',
        components: [
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'promoAddr', internalType: 'address', type: 'address' },
          { name: 'streams', internalType: 'address[]', type: 'address[]' },
          { name: 'description', internalType: 'string', type: 'string' },
        ],
      },
      { name: 'uri', internalType: 'string', type: 'string' },
    ],
    name: 'createPromo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'stream', internalType: 'address', type: 'address' }],
    name: 'getAvailablePromotions',
    outputs: [
      {
        name: '',
        internalType: 'struct Promotion[]',
        type: 'tuple[]',
        components: [
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'promoAddr', internalType: 'address', type: 'address' },
          { name: 'streams', internalType: 'address[]', type: 'address[]' },
          { name: 'description', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPaymentRecipientAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPaymentTokenAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPromoCreationPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'paymentToken', internalType: 'address', type: 'address' },
      { name: 'paymentRecipient', internalType: 'address', type: 'address' },
      { name: 'promoCreationPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'recipient', internalType: 'address', type: 'address' }],
    name: 'setPaymentRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'setPaymentToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'price', internalType: 'uint256', type: 'uint256' }],
    name: 'setPromoCreationPrice',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'PaymentRecipientSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'PaymentTokenSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PromoCreationPriceSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'marketer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'promotion',
        internalType: 'struct Promotion',
        type: 'tuple',
        components: [
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'promoAddr', internalType: 'address', type: 'address' },
          { name: 'streams', internalType: 'address[]', type: 'address[]' },
          { name: 'description', internalType: 'string', type: 'string' },
        ],
        indexed: false,
      },
    ],
    name: 'PromotionCreated',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'ZeroAddress' },
] as const;

export const promoFactoryAddress =
  '0x3d3E2D37151a812418FB075190f959a6C90C3A38' as const;

export const promoFactoryConfig = {
  address: promoFactoryAddress,
  abi: promoFactoryAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ticket
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ticketAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  {
    type: 'error',
    inputs: [{ name: 'cap', internalType: 'uint16', type: 'uint16' }],
    name: 'MaxCollectionSizeExceeded',
  },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'OnlyCreatorCanBurn' },
  { type: 'error', inputs: [], name: 'OnlyCreatorOrOwnerCanMint' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'TransfersAreNotAllowed' },
  { type: 'error', inputs: [], name: 'ZeroAddress' },
  { type: 'error', inputs: [], name: 'ZeroCap' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'approved',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'baseURI',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'BaseTokenURIChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MintTicket',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CAP',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'auth', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllOwners',
    outputs: [
      { name: 'currentOwners', internalType: 'address[]', type: 'address[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'promoFactory', internalType: 'address', type: 'address' },
    ],
    name: 'getAvailablePromotions',
    outputs: [
      {
        name: '',
        internalType: 'struct Promotion[]',
        type: 'tuple[]',
        components: [
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'promoAddr', internalType: 'address', type: 'address' },
          { name: 'streams', internalType: 'address[]', type: 'address[]' },
          { name: 'description', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'ticket',
        internalType: 'struct TicketParams',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          { name: 'baseUri', internalType: 'string', type: 'string' },
          { name: 'cap', internalType: 'uint16', type: 'uint16' },
        ],
      },
      { name: 'streamer', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'safeMint',
    outputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'baseTokenURI', internalType: 'string', type: 'string' }],
    name: 'setBaseTokenURI',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TicketFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ticketFactoryAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_PROTOCOL_FEE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'sale',
        internalType: 'struct SaleParams',
        type: 'tuple',
        components: [
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'paymentToken', internalType: 'address', type: 'address' },
        ],
      },
      {
        name: 'ticket',
        internalType: 'struct TicketParams',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          { name: 'baseUri', internalType: 'string', type: 'string' },
          { name: 'cap', internalType: 'uint16', type: 'uint16' },
        ],
      },
    ],
    name: 'createTicketSale',
    outputs: [
      { name: 'ticketSaleAddr', internalType: 'address', type: 'address' },
      { name: 'ticketAddr', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getImplementations',
    outputs: [
      { name: 'sale', internalType: 'address', type: 'address' },
      { name: 'ticket', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaxSalePeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProtocolFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'ticketSaleImplementation',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'ticketImplementation',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'protocolFeeRecipient',
        internalType: 'address',
        type: 'address',
      },
      { name: 'protocolFee', internalType: 'uint256', type: 'uint256' },
      { name: 'maxSalePeriod', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newMaxPeriod', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMaxSalePeriod',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newProtocolFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setProtocolFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newRecipient', internalType: 'address', type: 'address' },
    ],
    name: 'setProtocolFeeRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'setTicketImplementation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
    ],
    name: 'setTicketSaleImplementation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newMaxPeriod',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MaxSalePeriodSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newRecipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ProtocolFeeRecipientSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newProtocolFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProtocolFeeSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newImplementation',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TicketImplementationSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'ticketSaleAddr',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'ticketAddr',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TicketSaleCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newImplementation',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TicketSaleImplementationSet',
  },
  { type: 'error', inputs: [], name: 'ERC1167FailedCreateClone' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  {
    type: 'error',
    inputs: [{ name: 'maxPeriod', internalType: 'uint256', type: 'uint256' }],
    name: 'MaxSalePeriodExceeded',
  },
  { type: 'error', inputs: [], name: 'MaxSalePeriodIsTooLow' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'maxProtocolFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ProtocolFeeIsTooHigh',
  },
  { type: 'error', inputs: [], name: 'ZeroAddress' },
] as const;

export const ticketFactoryAddress =
  '0x42C593A0F50321EA473b5fAe6a4b76c212a26F54' as const;

export const ticketFactoryConfig = {
  address: ticketFactoryAddress,
  abi: ticketFactoryAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TicketSale
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ticketSaleAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'buy',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProtocolFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSaleParams',
    outputs: [
      {
        name: '',
        internalType: 'struct SaleParams',
        type: 'tuple',
        components: [
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'paymentToken', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalRaised',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'ticketImplementation',
        internalType: 'address',
        type: 'address',
      },
      { name: 'streamer', internalType: 'address', type: 'address' },
      { name: 'protocolFee', internalType: 'uint256', type: 'uint256' },
      {
        name: 'protocolFeeRecipient',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'sale',
        internalType: 'struct SaleParams',
        type: 'tuple',
        components: [
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'paymentToken', internalType: 'address', type: 'address' },
        ],
      },
      {
        name: 'ticketParams',
        internalType: 'struct TicketParams',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          { name: 'baseUri', internalType: 'string', type: 'string' },
          { name: 'cap', internalType: 'uint16', type: 'uint16' },
        ],
      },
    ],
    name: 'initialize',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'refund',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'endTime', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setTimeSettings',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Refund',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'streamer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'protocolFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'sale',
        internalType: 'struct SaleParams',
        type: 'tuple',
        components: [
          { name: 'startTime', internalType: 'uint256', type: 'uint256' },
          { name: 'endTime', internalType: 'uint256', type: 'uint256' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'paymentToken', internalType: 'address', type: 'address' },
        ],
        indexed: false,
      },
      {
        name: 'ticketParams',
        internalType: 'struct TicketParams',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'symbol', internalType: 'string', type: 'string' },
          { name: 'baseUri', internalType: 'string', type: 'string' },
          { name: 'cap', internalType: 'uint16', type: 'uint16' },
        ],
        indexed: false,
      },
    ],
    name: 'SaleAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'startTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'endTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SaleTimeSettingsChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'ticket',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'timestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Sold',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'streamer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'fee', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Withdrawn',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'ERC1167FailedCreateClone' },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidTimeSettings' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'SalesAlreadyStarted' },
  { type: 'error', inputs: [], name: 'SalesShouldBeActive' },
  { type: 'error', inputs: [], name: 'SalesShouldEnd' },
  { type: 'error', inputs: [], name: 'YouHaveAlreadyPurchasedTicket' },
  { type: 'error', inputs: [], name: 'ZeroAddress' },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link promoFactoryAbi}__
 */
export const useReadPromoFactory = /*#__PURE__*/ createUseReadContract({
  abi: promoFactoryAbi,
  address: promoFactoryAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"getAvailablePromotions"`
 */
export const useReadPromoFactoryGetAvailablePromotions =
  /*#__PURE__*/ createUseReadContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'getAvailablePromotions',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"getPaymentRecipientAddress"`
 */
export const useReadPromoFactoryGetPaymentRecipientAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'getPaymentRecipientAddress',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"getPaymentTokenAddress"`
 */
export const useReadPromoFactoryGetPaymentTokenAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'getPaymentTokenAddress',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"getPromoCreationPrice"`
 */
export const useReadPromoFactoryGetPromoCreationPrice =
  /*#__PURE__*/ createUseReadContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'getPromoCreationPrice',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"owner"`
 */
export const useReadPromoFactoryOwner = /*#__PURE__*/ createUseReadContract({
  abi: promoFactoryAbi,
  address: promoFactoryAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link promoFactoryAbi}__
 */
export const useWritePromoFactory = /*#__PURE__*/ createUseWriteContract({
  abi: promoFactoryAbi,
  address: promoFactoryAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"createPromo"`
 */
export const useWritePromoFactoryCreatePromo =
  /*#__PURE__*/ createUseWriteContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'createPromo',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"initialize"`
 */
export const useWritePromoFactoryInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'initialize',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWritePromoFactoryRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"setPaymentRecipient"`
 */
export const useWritePromoFactorySetPaymentRecipient =
  /*#__PURE__*/ createUseWriteContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'setPaymentRecipient',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"setPaymentToken"`
 */
export const useWritePromoFactorySetPaymentToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'setPaymentToken',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"setPromoCreationPrice"`
 */
export const useWritePromoFactorySetPromoCreationPrice =
  /*#__PURE__*/ createUseWriteContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'setPromoCreationPrice',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWritePromoFactoryTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link promoFactoryAbi}__
 */
export const useSimulatePromoFactory = /*#__PURE__*/ createUseSimulateContract({
  abi: promoFactoryAbi,
  address: promoFactoryAddress,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"createPromo"`
 */
export const useSimulatePromoFactoryCreatePromo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'createPromo',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulatePromoFactoryInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'initialize',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulatePromoFactoryRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"setPaymentRecipient"`
 */
export const useSimulatePromoFactorySetPaymentRecipient =
  /*#__PURE__*/ createUseSimulateContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'setPaymentRecipient',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"setPaymentToken"`
 */
export const useSimulatePromoFactorySetPaymentToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'setPaymentToken',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"setPromoCreationPrice"`
 */
export const useSimulatePromoFactorySetPromoCreationPrice =
  /*#__PURE__*/ createUseSimulateContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'setPromoCreationPrice',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulatePromoFactoryTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link promoFactoryAbi}__
 */
export const useWatchPromoFactoryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link promoFactoryAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchPromoFactoryInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    eventName: 'Initialized',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link promoFactoryAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchPromoFactoryOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link promoFactoryAbi}__ and `eventName` set to `"PaymentRecipientSet"`
 */
export const useWatchPromoFactoryPaymentRecipientSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    eventName: 'PaymentRecipientSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link promoFactoryAbi}__ and `eventName` set to `"PaymentTokenSet"`
 */
export const useWatchPromoFactoryPaymentTokenSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    eventName: 'PaymentTokenSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link promoFactoryAbi}__ and `eventName` set to `"PromoCreationPriceSet"`
 */
export const useWatchPromoFactoryPromoCreationPriceSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    eventName: 'PromoCreationPriceSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link promoFactoryAbi}__ and `eventName` set to `"PromotionCreated"`
 */
export const useWatchPromoFactoryPromotionCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    eventName: 'PromotionCreated',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketAbi}__
 */
export const useReadTicket = /*#__PURE__*/ createUseReadContract({
  abi: ticketAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"CAP"`
 */
export const useReadTicketCap = /*#__PURE__*/ createUseReadContract({
  abi: ticketAbi,
  functionName: 'CAP',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadTicketBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: ticketAbi,
  functionName: 'balanceOf',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"getAllOwners"`
 */
export const useReadTicketGetAllOwners = /*#__PURE__*/ createUseReadContract({
  abi: ticketAbi,
  functionName: 'getAllOwners',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"getApproved"`
 */
export const useReadTicketGetApproved = /*#__PURE__*/ createUseReadContract({
  abi: ticketAbi,
  functionName: 'getApproved',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"getAvailablePromotions"`
 */
export const useReadTicketGetAvailablePromotions =
  /*#__PURE__*/ createUseReadContract({
    abi: ticketAbi,
    functionName: 'getAvailablePromotions',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadTicketIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: ticketAbi,
    functionName: 'isApprovedForAll',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"name"`
 */
export const useReadTicketName = /*#__PURE__*/ createUseReadContract({
  abi: ticketAbi,
  functionName: 'name',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"owner"`
 */
export const useReadTicketOwner = /*#__PURE__*/ createUseReadContract({
  abi: ticketAbi,
  functionName: 'owner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadTicketOwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: ticketAbi,
  functionName: 'ownerOf',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadTicketSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: ticketAbi,
    functionName: 'supportsInterface',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadTicketSymbol = /*#__PURE__*/ createUseReadContract({
  abi: ticketAbi,
  functionName: 'symbol',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadTicketTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: ticketAbi,
  functionName: 'tokenURI',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadTicketTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: ticketAbi,
  functionName: 'totalSupply',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketAbi}__
 */
export const useWriteTicket = /*#__PURE__*/ createUseWriteContract({
  abi: ticketAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteTicketApprove = /*#__PURE__*/ createUseWriteContract({
  abi: ticketAbi,
  functionName: 'approve',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteTicketBurn = /*#__PURE__*/ createUseWriteContract({
  abi: ticketAbi,
  functionName: 'burn',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteTicketInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: ticketAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteTicketRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketAbi,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"safeMint"`
 */
export const useWriteTicketSafeMint = /*#__PURE__*/ createUseWriteContract({
  abi: ticketAbi,
  functionName: 'safeMint',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteTicketSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketAbi,
    functionName: 'safeTransferFrom',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteTicketSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketAbi,
    functionName: 'setApprovalForAll',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"setBaseTokenURI"`
 */
export const useWriteTicketSetBaseTokenUri =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketAbi,
    functionName: 'setBaseTokenURI',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteTicketTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: ticketAbi,
  functionName: 'transferFrom',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteTicketTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketAbi,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketAbi}__
 */
export const useSimulateTicket = /*#__PURE__*/ createUseSimulateContract({
  abi: ticketAbi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateTicketApprove = /*#__PURE__*/ createUseSimulateContract(
  { abi: ticketAbi, functionName: 'approve' },
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateTicketBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: ticketAbi,
  functionName: 'burn',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateTicketInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketAbi,
    functionName: 'initialize',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateTicketRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketAbi,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"safeMint"`
 */
export const useSimulateTicketSafeMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketAbi,
    functionName: 'safeMint',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateTicketSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketAbi,
    functionName: 'safeTransferFrom',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateTicketSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketAbi,
    functionName: 'setApprovalForAll',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"setBaseTokenURI"`
 */
export const useSimulateTicketSetBaseTokenUri =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketAbi,
    functionName: 'setBaseTokenURI',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateTicketTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketAbi,
    functionName: 'transferFrom',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateTicketTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketAbi,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketAbi}__
 */
export const useWatchTicketEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ticketAbi,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchTicketApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketAbi,
    eventName: 'Approval',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchTicketApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketAbi,
    eventName: 'ApprovalForAll',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketAbi}__ and `eventName` set to `"BaseTokenURIChanged"`
 */
export const useWatchTicketBaseTokenUriChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketAbi,
    eventName: 'BaseTokenURIChanged',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchTicketInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketAbi,
    eventName: 'Initialized',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketAbi}__ and `eventName` set to `"MintTicket"`
 */
export const useWatchTicketMintTicketEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketAbi,
    eventName: 'MintTicket',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchTicketOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketAbi,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchTicketTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketAbi,
    eventName: 'Transfer',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketFactoryAbi}__
 */
export const useReadTicketFactory = /*#__PURE__*/ createUseReadContract({
  abi: ticketFactoryAbi,
  address: ticketFactoryAddress,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"MAX_PROTOCOL_FEE"`
 */
export const useReadTicketFactoryMaxProtocolFee =
  /*#__PURE__*/ createUseReadContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'MAX_PROTOCOL_FEE',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"getImplementations"`
 */
export const useReadTicketFactoryGetImplementations =
  /*#__PURE__*/ createUseReadContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'getImplementations',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"getMaxSalePeriod"`
 */
export const useReadTicketFactoryGetMaxSalePeriod =
  /*#__PURE__*/ createUseReadContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'getMaxSalePeriod',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"getProtocolFee"`
 */
export const useReadTicketFactoryGetProtocolFee =
  /*#__PURE__*/ createUseReadContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'getProtocolFee',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"owner"`
 */
export const useReadTicketFactoryOwner = /*#__PURE__*/ createUseReadContract({
  abi: ticketFactoryAbi,
  address: ticketFactoryAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketFactoryAbi}__
 */
export const useWriteTicketFactory = /*#__PURE__*/ createUseWriteContract({
  abi: ticketFactoryAbi,
  address: ticketFactoryAddress,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"createTicketSale"`
 */
export const useWriteTicketFactoryCreateTicketSale =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'createTicketSale',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteTicketFactoryInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'initialize',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteTicketFactoryRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setMaxSalePeriod"`
 */
export const useWriteTicketFactorySetMaxSalePeriod =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setMaxSalePeriod',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setProtocolFee"`
 */
export const useWriteTicketFactorySetProtocolFee =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setProtocolFee',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setProtocolFeeRecipient"`
 */
export const useWriteTicketFactorySetProtocolFeeRecipient =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setProtocolFeeRecipient',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setTicketImplementation"`
 */
export const useWriteTicketFactorySetTicketImplementation =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setTicketImplementation',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setTicketSaleImplementation"`
 */
export const useWriteTicketFactorySetTicketSaleImplementation =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setTicketSaleImplementation',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteTicketFactoryTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__
 */
export const useSimulateTicketFactory = /*#__PURE__*/ createUseSimulateContract(
  { abi: ticketFactoryAbi, address: ticketFactoryAddress },
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"createTicketSale"`
 */
export const useSimulateTicketFactoryCreateTicketSale =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'createTicketSale',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateTicketFactoryInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'initialize',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateTicketFactoryRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setMaxSalePeriod"`
 */
export const useSimulateTicketFactorySetMaxSalePeriod =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setMaxSalePeriod',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setProtocolFee"`
 */
export const useSimulateTicketFactorySetProtocolFee =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setProtocolFee',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setProtocolFeeRecipient"`
 */
export const useSimulateTicketFactorySetProtocolFeeRecipient =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setProtocolFeeRecipient',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setTicketImplementation"`
 */
export const useSimulateTicketFactorySetTicketImplementation =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setTicketImplementation',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setTicketSaleImplementation"`
 */
export const useSimulateTicketFactorySetTicketSaleImplementation =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setTicketSaleImplementation',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateTicketFactoryTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__
 */
export const useWatchTicketFactoryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchTicketFactoryInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'Initialized',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"MaxSalePeriodSet"`
 */
export const useWatchTicketFactoryMaxSalePeriodSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'MaxSalePeriodSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchTicketFactoryOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"ProtocolFeeRecipientSet"`
 */
export const useWatchTicketFactoryProtocolFeeRecipientSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'ProtocolFeeRecipientSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"ProtocolFeeSet"`
 */
export const useWatchTicketFactoryProtocolFeeSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'ProtocolFeeSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"TicketImplementationSet"`
 */
export const useWatchTicketFactoryTicketImplementationSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'TicketImplementationSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"TicketSaleCreated"`
 */
export const useWatchTicketFactoryTicketSaleCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'TicketSaleCreated',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"TicketSaleImplementationSet"`
 */
export const useWatchTicketFactoryTicketSaleImplementationSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'TicketSaleImplementationSet',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketSaleAbi}__
 */
export const useReadTicketSale = /*#__PURE__*/ createUseReadContract({
  abi: ticketSaleAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"getProtocolFee"`
 */
export const useReadTicketSaleGetProtocolFee =
  /*#__PURE__*/ createUseReadContract({
    abi: ticketSaleAbi,
    functionName: 'getProtocolFee',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"getSaleParams"`
 */
export const useReadTicketSaleGetSaleParams =
  /*#__PURE__*/ createUseReadContract({
    abi: ticketSaleAbi,
    functionName: 'getSaleParams',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"getTotalRaised"`
 */
export const useReadTicketSaleGetTotalRaised =
  /*#__PURE__*/ createUseReadContract({
    abi: ticketSaleAbi,
    functionName: 'getTotalRaised',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"owner"`
 */
export const useReadTicketSaleOwner = /*#__PURE__*/ createUseReadContract({
  abi: ticketSaleAbi,
  functionName: 'owner',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketSaleAbi}__
 */
export const useWriteTicketSale = /*#__PURE__*/ createUseWriteContract({
  abi: ticketSaleAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"buy"`
 */
export const useWriteTicketSaleBuy = /*#__PURE__*/ createUseWriteContract({
  abi: ticketSaleAbi,
  functionName: 'buy',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteTicketSaleInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketSaleAbi,
    functionName: 'initialize',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"refund"`
 */
export const useWriteTicketSaleRefund = /*#__PURE__*/ createUseWriteContract({
  abi: ticketSaleAbi,
  functionName: 'refund',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteTicketSaleRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketSaleAbi,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"setTimeSettings"`
 */
export const useWriteTicketSaleSetTimeSettings =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketSaleAbi,
    functionName: 'setTimeSettings',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteTicketSaleTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ticketSaleAbi,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteTicketSaleWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: ticketSaleAbi,
  functionName: 'withdraw',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketSaleAbi}__
 */
export const useSimulateTicketSale = /*#__PURE__*/ createUseSimulateContract({
  abi: ticketSaleAbi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"buy"`
 */
export const useSimulateTicketSaleBuy = /*#__PURE__*/ createUseSimulateContract(
  { abi: ticketSaleAbi, functionName: 'buy' },
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateTicketSaleInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketSaleAbi,
    functionName: 'initialize',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"refund"`
 */
export const useSimulateTicketSaleRefund =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketSaleAbi,
    functionName: 'refund',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateTicketSaleRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketSaleAbi,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"setTimeSettings"`
 */
export const useSimulateTicketSaleSetTimeSettings =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketSaleAbi,
    functionName: 'setTimeSettings',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateTicketSaleTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketSaleAbi,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateTicketSaleWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ticketSaleAbi,
    functionName: 'withdraw',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__
 */
export const useWatchTicketSaleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: ticketSaleAbi });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchTicketSaleInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketSaleAbi,
    eventName: 'Initialized',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchTicketSaleOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketSaleAbi,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__ and `eventName` set to `"Refund"`
 */
export const useWatchTicketSaleRefundEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketSaleAbi,
    eventName: 'Refund',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__ and `eventName` set to `"SaleAdded"`
 */
export const useWatchTicketSaleSaleAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketSaleAbi,
    eventName: 'SaleAdded',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__ and `eventName` set to `"SaleTimeSettingsChanged"`
 */
export const useWatchTicketSaleSaleTimeSettingsChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketSaleAbi,
    eventName: 'SaleTimeSettingsChanged',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__ and `eventName` set to `"Sold"`
 */
export const useWatchTicketSaleSoldEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketSaleAbi,
    eventName: 'Sold',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__ and `eventName` set to `"Withdrawn"`
 */
export const useWatchTicketSaleWithdrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ticketSaleAbi,
    eventName: 'Withdrawn',
  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link promoFactoryAbi}__
 */
export const readPromoFactory = /*#__PURE__*/ createReadContract({
  abi: promoFactoryAbi,
  address: promoFactoryAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"getAvailablePromotions"`
 */
export const readPromoFactoryGetAvailablePromotions =
  /*#__PURE__*/ createReadContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'getAvailablePromotions',
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"getPaymentRecipientAddress"`
 */
export const readPromoFactoryGetPaymentRecipientAddress =
  /*#__PURE__*/ createReadContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'getPaymentRecipientAddress',
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"getPaymentTokenAddress"`
 */
export const readPromoFactoryGetPaymentTokenAddress =
  /*#__PURE__*/ createReadContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'getPaymentTokenAddress',
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"getPromoCreationPrice"`
 */
export const readPromoFactoryGetPromoCreationPrice =
  /*#__PURE__*/ createReadContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'getPromoCreationPrice',
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"owner"`
 */
export const readPromoFactoryOwner = /*#__PURE__*/ createReadContract({
  abi: promoFactoryAbi,
  address: promoFactoryAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link promoFactoryAbi}__
 */
export const writePromoFactory = /*#__PURE__*/ createWriteContract({
  abi: promoFactoryAbi,
  address: promoFactoryAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"createPromo"`
 */
export const writePromoFactoryCreatePromo = /*#__PURE__*/ createWriteContract({
  abi: promoFactoryAbi,
  address: promoFactoryAddress,
  functionName: 'createPromo',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"initialize"`
 */
export const writePromoFactoryInitialize = /*#__PURE__*/ createWriteContract({
  abi: promoFactoryAbi,
  address: promoFactoryAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writePromoFactoryRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"setPaymentRecipient"`
 */
export const writePromoFactorySetPaymentRecipient =
  /*#__PURE__*/ createWriteContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'setPaymentRecipient',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"setPaymentToken"`
 */
export const writePromoFactorySetPaymentToken =
  /*#__PURE__*/ createWriteContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'setPaymentToken',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"setPromoCreationPrice"`
 */
export const writePromoFactorySetPromoCreationPrice =
  /*#__PURE__*/ createWriteContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'setPromoCreationPrice',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writePromoFactoryTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link promoFactoryAbi}__
 */
export const simulatePromoFactory = /*#__PURE__*/ createSimulateContract({
  abi: promoFactoryAbi,
  address: promoFactoryAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"createPromo"`
 */
export const simulatePromoFactoryCreatePromo =
  /*#__PURE__*/ createSimulateContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'createPromo',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"initialize"`
 */
export const simulatePromoFactoryInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'initialize',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulatePromoFactoryRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"setPaymentRecipient"`
 */
export const simulatePromoFactorySetPaymentRecipient =
  /*#__PURE__*/ createSimulateContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'setPaymentRecipient',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"setPaymentToken"`
 */
export const simulatePromoFactorySetPaymentToken =
  /*#__PURE__*/ createSimulateContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'setPaymentToken',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"setPromoCreationPrice"`
 */
export const simulatePromoFactorySetPromoCreationPrice =
  /*#__PURE__*/ createSimulateContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'setPromoCreationPrice',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link promoFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulatePromoFactoryTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link promoFactoryAbi}__
 */
export const watchPromoFactoryEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: promoFactoryAbi,
  address: promoFactoryAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link promoFactoryAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchPromoFactoryInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    eventName: 'Initialized',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link promoFactoryAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchPromoFactoryOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link promoFactoryAbi}__ and `eventName` set to `"PaymentRecipientSet"`
 */
export const watchPromoFactoryPaymentRecipientSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    eventName: 'PaymentRecipientSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link promoFactoryAbi}__ and `eventName` set to `"PaymentTokenSet"`
 */
export const watchPromoFactoryPaymentTokenSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    eventName: 'PaymentTokenSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link promoFactoryAbi}__ and `eventName` set to `"PromoCreationPriceSet"`
 */
export const watchPromoFactoryPromoCreationPriceSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    eventName: 'PromoCreationPriceSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link promoFactoryAbi}__ and `eventName` set to `"PromotionCreated"`
 */
export const watchPromoFactoryPromotionCreatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: promoFactoryAbi,
    address: promoFactoryAddress,
    eventName: 'PromotionCreated',
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketAbi}__
 */
export const readTicket = /*#__PURE__*/ createReadContract({ abi: ticketAbi });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"CAP"`
 */
export const readTicketCap = /*#__PURE__*/ createReadContract({
  abi: ticketAbi,
  functionName: 'CAP',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readTicketBalanceOf = /*#__PURE__*/ createReadContract({
  abi: ticketAbi,
  functionName: 'balanceOf',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"getAllOwners"`
 */
export const readTicketGetAllOwners = /*#__PURE__*/ createReadContract({
  abi: ticketAbi,
  functionName: 'getAllOwners',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"getApproved"`
 */
export const readTicketGetApproved = /*#__PURE__*/ createReadContract({
  abi: ticketAbi,
  functionName: 'getApproved',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"getAvailablePromotions"`
 */
export const readTicketGetAvailablePromotions =
  /*#__PURE__*/ createReadContract({
    abi: ticketAbi,
    functionName: 'getAvailablePromotions',
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readTicketIsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: ticketAbi,
  functionName: 'isApprovedForAll',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"name"`
 */
export const readTicketName = /*#__PURE__*/ createReadContract({
  abi: ticketAbi,
  functionName: 'name',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"owner"`
 */
export const readTicketOwner = /*#__PURE__*/ createReadContract({
  abi: ticketAbi,
  functionName: 'owner',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"ownerOf"`
 */
export const readTicketOwnerOf = /*#__PURE__*/ createReadContract({
  abi: ticketAbi,
  functionName: 'ownerOf',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readTicketSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: ticketAbi,
  functionName: 'supportsInterface',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"symbol"`
 */
export const readTicketSymbol = /*#__PURE__*/ createReadContract({
  abi: ticketAbi,
  functionName: 'symbol',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"tokenURI"`
 */
export const readTicketTokenUri = /*#__PURE__*/ createReadContract({
  abi: ticketAbi,
  functionName: 'tokenURI',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readTicketTotalSupply = /*#__PURE__*/ createReadContract({
  abi: ticketAbi,
  functionName: 'totalSupply',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketAbi}__
 */
export const writeTicket = /*#__PURE__*/ createWriteContract({
  abi: ticketAbi,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"approve"`
 */
export const writeTicketApprove = /*#__PURE__*/ createWriteContract({
  abi: ticketAbi,
  functionName: 'approve',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"burn"`
 */
export const writeTicketBurn = /*#__PURE__*/ createWriteContract({
  abi: ticketAbi,
  functionName: 'burn',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"initialize"`
 */
export const writeTicketInitialize = /*#__PURE__*/ createWriteContract({
  abi: ticketAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeTicketRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: ticketAbi,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"safeMint"`
 */
export const writeTicketSafeMint = /*#__PURE__*/ createWriteContract({
  abi: ticketAbi,
  functionName: 'safeMint',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeTicketSafeTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: ticketAbi,
  functionName: 'safeTransferFrom',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeTicketSetApprovalForAll = /*#__PURE__*/ createWriteContract({
  abi: ticketAbi,
  functionName: 'setApprovalForAll',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"setBaseTokenURI"`
 */
export const writeTicketSetBaseTokenUri = /*#__PURE__*/ createWriteContract({
  abi: ticketAbi,
  functionName: 'setBaseTokenURI',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeTicketTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: ticketAbi,
  functionName: 'transferFrom',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeTicketTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: ticketAbi,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketAbi}__
 */
export const simulateTicket = /*#__PURE__*/ createSimulateContract({
  abi: ticketAbi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"approve"`
 */
export const simulateTicketApprove = /*#__PURE__*/ createSimulateContract({
  abi: ticketAbi,
  functionName: 'approve',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"burn"`
 */
export const simulateTicketBurn = /*#__PURE__*/ createSimulateContract({
  abi: ticketAbi,
  functionName: 'burn',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateTicketInitialize = /*#__PURE__*/ createSimulateContract({
  abi: ticketAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateTicketRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketAbi,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"safeMint"`
 */
export const simulateTicketSafeMint = /*#__PURE__*/ createSimulateContract({
  abi: ticketAbi,
  functionName: 'safeMint',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateTicketSafeTransferFrom =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketAbi,
    functionName: 'safeTransferFrom',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateTicketSetApprovalForAll =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketAbi,
    functionName: 'setApprovalForAll',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"setBaseTokenURI"`
 */
export const simulateTicketSetBaseTokenUri =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketAbi,
    functionName: 'setBaseTokenURI',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateTicketTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: ticketAbi,
  functionName: 'transferFrom',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateTicketTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketAbi,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketAbi}__
 */
export const watchTicketEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ticketAbi,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketAbi}__ and `eventName` set to `"Approval"`
 */
export const watchTicketApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ticketAbi,
  eventName: 'Approval',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchTicketApprovalForAllEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketAbi,
    eventName: 'ApprovalForAll',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketAbi}__ and `eventName` set to `"BaseTokenURIChanged"`
 */
export const watchTicketBaseTokenUriChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketAbi,
    eventName: 'BaseTokenURIChanged',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchTicketInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketAbi,
    eventName: 'Initialized',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketAbi}__ and `eventName` set to `"MintTicket"`
 */
export const watchTicketMintTicketEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketAbi,
    eventName: 'MintTicket',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchTicketOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketAbi,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchTicketTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ticketAbi,
  eventName: 'Transfer',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketFactoryAbi}__
 */
export const readTicketFactory = /*#__PURE__*/ createReadContract({
  abi: ticketFactoryAbi,
  address: ticketFactoryAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"MAX_PROTOCOL_FEE"`
 */
export const readTicketFactoryMaxProtocolFee = /*#__PURE__*/ createReadContract(
  {
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'MAX_PROTOCOL_FEE',
  },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"getImplementations"`
 */
export const readTicketFactoryGetImplementations =
  /*#__PURE__*/ createReadContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'getImplementations',
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"getMaxSalePeriod"`
 */
export const readTicketFactoryGetMaxSalePeriod =
  /*#__PURE__*/ createReadContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'getMaxSalePeriod',
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"getProtocolFee"`
 */
export const readTicketFactoryGetProtocolFee = /*#__PURE__*/ createReadContract(
  {
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'getProtocolFee',
  },
);

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"owner"`
 */
export const readTicketFactoryOwner = /*#__PURE__*/ createReadContract({
  abi: ticketFactoryAbi,
  address: ticketFactoryAddress,
  functionName: 'owner',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketFactoryAbi}__
 */
export const writeTicketFactory = /*#__PURE__*/ createWriteContract({
  abi: ticketFactoryAbi,
  address: ticketFactoryAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"createTicketSale"`
 */
export const writeTicketFactoryCreateTicketSale =
  /*#__PURE__*/ createWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'createTicketSale',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"initialize"`
 */
export const writeTicketFactoryInitialize = /*#__PURE__*/ createWriteContract({
  abi: ticketFactoryAbi,
  address: ticketFactoryAddress,
  functionName: 'initialize',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeTicketFactoryRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setMaxSalePeriod"`
 */
export const writeTicketFactorySetMaxSalePeriod =
  /*#__PURE__*/ createWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setMaxSalePeriod',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setProtocolFee"`
 */
export const writeTicketFactorySetProtocolFee =
  /*#__PURE__*/ createWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setProtocolFee',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setProtocolFeeRecipient"`
 */
export const writeTicketFactorySetProtocolFeeRecipient =
  /*#__PURE__*/ createWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setProtocolFeeRecipient',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setTicketImplementation"`
 */
export const writeTicketFactorySetTicketImplementation =
  /*#__PURE__*/ createWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setTicketImplementation',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setTicketSaleImplementation"`
 */
export const writeTicketFactorySetTicketSaleImplementation =
  /*#__PURE__*/ createWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setTicketSaleImplementation',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeTicketFactoryTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__
 */
export const simulateTicketFactory = /*#__PURE__*/ createSimulateContract({
  abi: ticketFactoryAbi,
  address: ticketFactoryAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"createTicketSale"`
 */
export const simulateTicketFactoryCreateTicketSale =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'createTicketSale',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateTicketFactoryInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'initialize',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateTicketFactoryRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setMaxSalePeriod"`
 */
export const simulateTicketFactorySetMaxSalePeriod =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setMaxSalePeriod',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setProtocolFee"`
 */
export const simulateTicketFactorySetProtocolFee =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setProtocolFee',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setProtocolFeeRecipient"`
 */
export const simulateTicketFactorySetProtocolFeeRecipient =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setProtocolFeeRecipient',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setTicketImplementation"`
 */
export const simulateTicketFactorySetTicketImplementation =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setTicketImplementation',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"setTicketSaleImplementation"`
 */
export const simulateTicketFactorySetTicketSaleImplementation =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'setTicketSaleImplementation',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketFactoryAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateTicketFactoryTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__
 */
export const watchTicketFactoryEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ticketFactoryAbi,
  address: ticketFactoryAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchTicketFactoryInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'Initialized',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"MaxSalePeriodSet"`
 */
export const watchTicketFactoryMaxSalePeriodSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'MaxSalePeriodSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchTicketFactoryOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"ProtocolFeeRecipientSet"`
 */
export const watchTicketFactoryProtocolFeeRecipientSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'ProtocolFeeRecipientSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"ProtocolFeeSet"`
 */
export const watchTicketFactoryProtocolFeeSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'ProtocolFeeSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"TicketImplementationSet"`
 */
export const watchTicketFactoryTicketImplementationSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'TicketImplementationSet',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"TicketSaleCreated"`
 */
export const watchTicketFactoryTicketSaleCreatedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'TicketSaleCreated',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketFactoryAbi}__ and `eventName` set to `"TicketSaleImplementationSet"`
 */
export const watchTicketFactoryTicketSaleImplementationSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketFactoryAbi,
    address: ticketFactoryAddress,
    eventName: 'TicketSaleImplementationSet',
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketSaleAbi}__
 */
export const readTicketSale = /*#__PURE__*/ createReadContract({
  abi: ticketSaleAbi,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"getProtocolFee"`
 */
export const readTicketSaleGetProtocolFee = /*#__PURE__*/ createReadContract({
  abi: ticketSaleAbi,
  functionName: 'getProtocolFee',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"getSaleParams"`
 */
export const readTicketSaleGetSaleParams = /*#__PURE__*/ createReadContract({
  abi: ticketSaleAbi,
  functionName: 'getSaleParams',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"getTotalRaised"`
 */
export const readTicketSaleGetTotalRaised = /*#__PURE__*/ createReadContract({
  abi: ticketSaleAbi,
  functionName: 'getTotalRaised',
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"owner"`
 */
export const readTicketSaleOwner = /*#__PURE__*/ createReadContract({
  abi: ticketSaleAbi,
  functionName: 'owner',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketSaleAbi}__
 */
export const writeTicketSale = /*#__PURE__*/ createWriteContract({
  abi: ticketSaleAbi,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"buy"`
 */
export const writeTicketSaleBuy = /*#__PURE__*/ createWriteContract({
  abi: ticketSaleAbi,
  functionName: 'buy',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"initialize"`
 */
export const writeTicketSaleInitialize = /*#__PURE__*/ createWriteContract({
  abi: ticketSaleAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"refund"`
 */
export const writeTicketSaleRefund = /*#__PURE__*/ createWriteContract({
  abi: ticketSaleAbi,
  functionName: 'refund',
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeTicketSaleRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: ticketSaleAbi,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"setTimeSettings"`
 */
export const writeTicketSaleSetTimeSettings = /*#__PURE__*/ createWriteContract(
  { abi: ticketSaleAbi, functionName: 'setTimeSettings' },
);

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeTicketSaleTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: ticketSaleAbi,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"withdraw"`
 */
export const writeTicketSaleWithdraw = /*#__PURE__*/ createWriteContract({
  abi: ticketSaleAbi,
  functionName: 'withdraw',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketSaleAbi}__
 */
export const simulateTicketSale = /*#__PURE__*/ createSimulateContract({
  abi: ticketSaleAbi,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"buy"`
 */
export const simulateTicketSaleBuy = /*#__PURE__*/ createSimulateContract({
  abi: ticketSaleAbi,
  functionName: 'buy',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"initialize"`
 */
export const simulateTicketSaleInitialize =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketSaleAbi,
    functionName: 'initialize',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"refund"`
 */
export const simulateTicketSaleRefund = /*#__PURE__*/ createSimulateContract({
  abi: ticketSaleAbi,
  functionName: 'refund',
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateTicketSaleRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketSaleAbi,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"setTimeSettings"`
 */
export const simulateTicketSaleSetTimeSettings =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketSaleAbi,
    functionName: 'setTimeSettings',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateTicketSaleTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: ticketSaleAbi,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link ticketSaleAbi}__ and `functionName` set to `"withdraw"`
 */
export const simulateTicketSaleWithdraw = /*#__PURE__*/ createSimulateContract({
  abi: ticketSaleAbi,
  functionName: 'withdraw',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__
 */
export const watchTicketSaleEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ticketSaleAbi,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__ and `eventName` set to `"Initialized"`
 */
export const watchTicketSaleInitializedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketSaleAbi,
    eventName: 'Initialized',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchTicketSaleOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketSaleAbi,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__ and `eventName` set to `"Refund"`
 */
export const watchTicketSaleRefundEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketSaleAbi,
    eventName: 'Refund',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__ and `eventName` set to `"SaleAdded"`
 */
export const watchTicketSaleSaleAddedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketSaleAbi,
    eventName: 'SaleAdded',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__ and `eventName` set to `"SaleTimeSettingsChanged"`
 */
export const watchTicketSaleSaleTimeSettingsChangedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketSaleAbi,
    eventName: 'SaleTimeSettingsChanged',
  });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__ and `eventName` set to `"Sold"`
 */
export const watchTicketSaleSoldEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: ticketSaleAbi,
  eventName: 'Sold',
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link ticketSaleAbi}__ and `eventName` set to `"Withdrawn"`
 */
export const watchTicketSaleWithdrawnEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: ticketSaleAbi,
    eventName: 'Withdrawn',
  });
