import { getAddress } from 'viem'

export const CDP_MANAGER_ADDRESS = '0x5ef30b9986345249bc32d8928B7ee64DE9435E39' as const;
export const VAT_ADDRESS = '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B' as const;

export const SPOTTER_ADDRESS = getAddress('0x65c79fcb50ca1594b025960e539ed7a9a6d434a3')


// Functions from CDP Manager
export const CDP_MANAGER_ABI = [
    {
        //ID of the last CDP ever created. Tells the upper bound for fetching
        name: 'cdpi',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }]
    },
    {
        //Owners Ethereum address
        name: 'owns',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'cdp', type: 'uint256' }],
        outputs: [{ name: '', type: 'address' }]
    },
    {
        //Collateral type identifier
        name: 'ilks',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'cdp', type: 'uint256' }],
        outputs: [{ name: '', type: 'bytes32' }]
    },
    {
        //Personal vault address inside the Vat where the actual collateral/debt accounting lives
        name: 'urns',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'cdp', type: 'uint256' }],
        outputs: [{ name: '', type: 'address' }],
    }
] as const;


// Functions from Vat
export const VAT_ABI = [
    {
        // For given ilk and urn address returns (ink, art) 
        name: 'urns',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'ilk', type: 'bytes32' },
            { name: 'urn', type: 'address' }
        ],
        outputs: [
            { name: 'ilk', type: 'uint256' }, // collateral amount in wei
            { name: 'art', type: 'uint256' } // normalized debt, not actual DAI yet, needs to be multiplied by rate
        ]
    },
    {
        // For given ilk returns several values, but we only are about rate
        name: 'ilks',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'ilk', type: 'bytes32' }],
        outputs: [
            { name: 'Art', type: 'uint256' },
            { name: 'rate', type: 'uint256' }, // used for getting actual debt = art x rate / 10^27
            { name: 'spor', type: 'uint256' },
            { name: 'line', type: 'uint256' },
            { name: 'dust', type: 'uint256' }
        ]
    }
] as const;

export const DS_PROXY_ABI = [
    {
        name: 'owner',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'address' }],
    },
] as const

export const SPOTTER_ABI = [
    {
        name: 'ilks',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'ilk', type: 'bytes32' }],
        outputs: [
            { name: 'pip', type: 'address' },
            { name: 'mat', type: 'uint256' },
        ],
    },
] as const