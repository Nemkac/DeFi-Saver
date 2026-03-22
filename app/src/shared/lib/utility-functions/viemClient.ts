import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const client = createPublicClient({
    chain: mainnet,
    transport: http(`https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`),
})