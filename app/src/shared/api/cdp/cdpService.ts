import { hexToString } from 'viem'
import { ilkToAsset } from '@defisaver/tokens'
import { client } from '../../lib/utility-functions/viemClient'
import { CDP_MANAGER_ADDRESS, CDP_MANAGER_ABI, VAT_ABI, VAT_ADDRESS, SPOTTER_ADDRESS, SPOTTER_ABI } from './contracts'
import type { Position } from '#/shared/api/types/position'

export type CollateralFilter = 'ETH-A' | 'WBTC-A' | 'USDC-A' | null

export type CdpDetail = {
    liquidationRatio: number
    liquidationPrice: number
}

const WAD = 10n ** 18n
const RAY = 10n ** 27n

async function fetchBatch(ids: bigint[]): Promise<Position[]> {
    if (ids.length === 0) return []

    const managerResults = await client.multicall({
        contracts: ids.flatMap((id) => [
            { address: CDP_MANAGER_ADDRESS, abi: CDP_MANAGER_ABI, functionName: 'owns', args: [id] },
            { address: CDP_MANAGER_ADDRESS, abi: CDP_MANAGER_ABI, functionName: 'ilks', args: [id] },
            { address: CDP_MANAGER_ADDRESS, abi: CDP_MANAGER_ABI, functionName: 'urns', args: [id] },
        ]),
    })

    const cdpData = ids
        .map((id, i) => ({
            id,
            owner: managerResults[i * 3].result as unknown as `0x${string}`,
            ilkBytes: managerResults[i * 3 + 1].result as unknown as `0x${string}`,
            urnAddress: managerResults[i * 3 + 2].result as unknown as `0x${string}`,
        }))
        .filter((c) => c.ilkBytes && c.urnAddress)

    if (cdpData.length === 0) return []

    const uniqueIlkBytes = [...new Set(cdpData.map((c) => c.ilkBytes))]

    const vatResults = await client.multicall({
        contracts: [
            ...cdpData.map((c) => ({
                address: VAT_ADDRESS,
                abi: VAT_ABI,
                functionName: 'urns' as const,
                args: [c.ilkBytes, c.urnAddress] as [`0x${string}`, `0x${string}`],
            })),
            ...uniqueIlkBytes.map((ilk) => ({
                address: VAT_ADDRESS,
                abi: VAT_ABI,
                functionName: 'ilks' as const,
                args: [ilk] as [`0x${string}`],
            })),
        ],
    })

    const vatUrnResults = vatResults.slice(0, cdpData.length)
    const vatIlkResults = vatResults.slice(cdpData.length)

    const ilkDataMap = new Map(
        uniqueIlkBytes.map((ilk, i) => [
            ilk,
            vatIlkResults[i].result as unknown as [bigint, bigint, bigint, bigint, bigint] | undefined,
        ])
    )

    const positions: Position[] = []

    for (let i = 0; i < cdpData.length; i++) {
        const cdp = cdpData[i]
        const urnResult = vatUrnResults[i].result as unknown as [bigint, bigint] | undefined
        const ilkResult = ilkDataMap.get(cdp.ilkBytes)

        if (!urnResult || !ilkResult) continue

        const [ink, art] = urnResult
        const rate = ilkResult[1]
        const spot = ilkResult[2]

        if (art === 0n) continue

        const collateralValueWad = (ink * spot) / RAY
        const actualDebtWad = (art * rate) / RAY
        const collateralAmount = Number(ink) / Number(WAD)
        const collateralValueUsd = Number(collateralValueWad) / Number(WAD)
        const actualDebt = Number(actualDebtWad) / Number(WAD)

        if (collateralAmount < 0.001 && actualDebt < 0.01) continue

        const ratio = actualDebt > 0 ? (collateralValueUsd / actualDebt) * 100 : 0
        const ilk = hexToString(cdp.ilkBytes).replace(/\x00/g, '')
        const collateralSymbol = ilkToAsset(ilk)

        positions.push({
            id: cdp.id.toString(),
            owner: cdp.owner,
            ilk,
            ilkBytes: cdp.ilkBytes,
            collateralAmount,
            actualDebt,
            collateral: `${collateralAmount.toFixed(2)} ${collateralSymbol}`,
            debt: `$${actualDebt.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
            ratio: Math.round(ratio * 100) / 100,
        })
    }

    return positions
}

export async function fetchCdps(
    searchId: string | null,
    collateralFilter: CollateralFilter,
    onProgress?: (message: string) => void
): Promise<Position[]> {
    onProgress?.('Fetching latest CDP ID...')
    const lastId = await client.readContract({
        address: CDP_MANAGER_ADDRESS,
        abi: CDP_MANAGER_ABI,
        functionName: 'cdpi',
    })

    const targetId = searchId ? BigInt(searchId) : lastId
    const BATCH_SIZE = 50n
    const MAX_RINGS = 15  // scan up to 750 IDs in each direction before giving up

    const collected: Position[] = []

    for (let ring = 0; ring < MAX_RINGS; ring++) {
        // Each ring covers 50 IDs on each side of the target
        const lowerFrom = targetId - BigInt(ring + 1) * BATCH_SIZE
        const lowerTo = targetId - BigInt(ring) * BATCH_SIZE - 1n
        const upperFrom = targetId + BigInt(ring) * BATCH_SIZE
        const upperTo = targetId + BigInt(ring + 1) * BATCH_SIZE - 1n

        const lowerIds: bigint[] = []
        for (let i = lowerFrom > 0n ? lowerFrom : 1n; i <= lowerTo && i >= 1n; i++) {
            lowerIds.push(i)
        }

        const upperIds: bigint[] = []
        for (let i = upperFrom; i <= upperTo && i <= lastId; i++) {
            upperIds.push(i)
        }

        // Fetch both sides concurrently — 2 concurrent HTTP calls max
        onProgress?.(`Scanning ring ${ring + 1}, found ${collected.length} so far...`)
        const [lowerPositions, upperPositions] = await Promise.all([
            lowerIds.length > 0 ? fetchBatch(lowerIds) : Promise.resolve([]),
            upperIds.length > 0 ? fetchBatch(upperIds) : Promise.resolve([]),
        ])

        const ringPositions = [...lowerPositions, ...upperPositions]
        const matching = !collateralFilter
            ? ringPositions
            : ringPositions.filter((p) => p.ilk === collateralFilter)

        collected.push(...matching)

        // Stop as soon as we have enough
        if (collected.length >= 20) break

        // Stop if we've hit both boundaries
        if (lowerFrom <= 1n && upperTo >= lastId) break
    }

    // Sort by proximity to target ID
    collected.sort((a, b) => {
        const distA = Math.abs(Number(a.id) - Number(targetId))
        const distB = Math.abs(Number(b.id) - Number(targetId))
        return distA - distB
    })

    return collected.slice(0, 20)
}

export async function fetchLastCdps(): Promise<Position[]> {
    const positions = await fetchCdps(null, null)
    return positions.slice(0, 10)
}

export async function fetchCdpDetail(
    ilkBytes: string,
    collateralAmount: number,
    actualDebt: number
): Promise<CdpDetail> {
    const results = await client.multicall({
        contracts: [
            {
                address: SPOTTER_ADDRESS,
                abi: SPOTTER_ABI,
                functionName: 'ilks',
                args: [ilkBytes as `0x${string}`],
            },
        ],
    })

    const mat = (results[0].result as unknown as [string, bigint])[1]
    const RAY = 10n ** 27n

    const liquidationRatio = Math.round((Number(mat) / Number(RAY)) * 100 * 100) / 100
    const liquidationPrice = collateralAmount > 0
        ? Math.round((actualDebt * (Number(mat) / Number(RAY))) / collateralAmount * 100) / 100
        : 0

    return { liquidationRatio, liquidationPrice }
}