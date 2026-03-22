import { getAddress } from 'viem'

export const CDP_MANAGER_ADDRESS = '0x5ef30b9986345249bc32d8928B7ee64DE9435E39' as const;
export const VAT_ADDRESS = '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B' as const;
export const VAULT_INFO_ADDRESS = '0x68C61AF097b834c68eA6EA5e46aF6c04E8945B2d' as const;

export const SPOTTER_ADDRESS = getAddress('0x65c79fcb50ca1594b025960e539ed7a9a6d434a3')


export const CDP_MANAGER_ABI = [
    {
        name: 'cdpi',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }]
    },
] as const;

export const VAULT_INFO_ABI = [
    {
        name: 'getCdpInfo',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: '_cdpId', type: 'uint256' }],
        outputs: [
            { name: 'urn', type: 'address' },
            { name: 'owner', type: 'address' },
            { name: 'userAddr', type: 'address' },
            { name: 'ilk', type: 'bytes32' },
            { name: 'collateral', type: 'uint256' },
            { name: 'debt', type: 'uint256' },
        ],
    },
] as const;


export const VAT_ABI = [
    {
        name: 'urns',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'ilk', type: 'bytes32' },
            { name: 'urn', type: 'address' }
        ],
        outputs: [
            { name: 'ilk', type: 'uint256' },
            { name: 'art', type: 'uint256' }
        ]
    },
    {
        name: 'ilks',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'ilk', type: 'bytes32' }],
        outputs: [
            { name: 'Art', type: 'uint256' },
            { name: 'rate', type: 'uint256' },
            { name: 'spor', type: 'uint256' },
            { name: 'line', type: 'uint256' },
            { name: 'dust', type: 'uint256' }
        ]
    }
] as const;

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