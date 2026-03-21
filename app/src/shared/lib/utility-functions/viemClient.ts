import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const client = createPublicClient({
    chain: mainnet,
    transport: http('https://mainnet.infura.io/v3/768108e7714043f4aa100fc19a9ee9c4'),
})