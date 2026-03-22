import { hexToString } from 'viem'
import { ilkToAsset } from '@defisaver/tokens'
import { client } from '../../lib/utility-functions/viemClient'
import { CDP_MANAGER_ADDRESS, CDP_MANAGER_ABI, VAT_ABI, VAT_ADDRESS, SPOTTER_ADDRESS, SPOTTER_ABI, VAULT_INFO_ADDRESS, VAULT_INFO_ABI } from './contracts'
import type { Position } from '#/shared/api/types/position'
import type { CdpInfo } from '../types/cdp-info'

export type CollateralFilter = 'ETH-A' | 'WBTC-A' | 'USDC-A' | null

export type CdpDetail = {
    liquidationRatio: number
    liquidationPrice: number
}

const WAD = 10n ** 18n
const RAY = 10n ** 27n

async function fetchBatch(ids: bigint[]): Promise<Position[]> {
    if (ids.length === 0) return []

    const infoResults = await client.multicall({
        contracts: ids.map((id) => ({
            address: VAULT_INFO_ADDRESS,
            abi: VAULT_INFO_ABI,
            functionName: 'getCdpInfo' as const,
            args: [id] as [bigint],
        })),
    })

    const cdpData: CdpInfo[] = []
    for (let i = 0; i < ids.length; i++) {
        const result = infoResults[i].result as [`0x${string}`, `0x${string}`, `0x${string}`, `0x${string}`, bigint, bigint] | undefined
        if (!result) continue
        const [urn, owner, userAddr, ilkBytes, ink, art] = result
        if (!ilkBytes || urn === '0x0000000000000000000000000000000000000000') continue
        cdpData.push({ id: ids[i], owner, userAddr, ilkBytes, ink, art })
    }

    if (cdpData.length === 0) return []

    const uniqueIlkBytes = [...new Set(cdpData.map((c) => c.ilkBytes))]

    const ilkResults = await client.multicall({
        contracts: [
            ...uniqueIlkBytes.map((ilk) => ({
                address: VAT_ADDRESS,
                abi: VAT_ABI,
                functionName: 'ilks' as const,
                args: [ilk] as [`0x${string}`],
            })),
            ...uniqueIlkBytes.map((ilk) => ({
                address: SPOTTER_ADDRESS,
                abi: SPOTTER_ABI,
                functionName: 'ilks' as const,
                args: [ilk] as [`0x${string}`],
            })),
        ],
    })

    const vatIlkResults = ilkResults.slice(0, uniqueIlkBytes.length)
    const spotterIlkResults = ilkResults.slice(uniqueIlkBytes.length)

    const ilkDataMap = new Map(
        uniqueIlkBytes.map((ilk, i) => [
            ilk,
            vatIlkResults[i].result as unknown as [bigint, bigint, bigint, bigint, bigint] | undefined,
        ])
    )

    const liquidationRatioMap = new Map(
        uniqueIlkBytes.map((ilk, i) => {
            const mat = (spotterIlkResults[i].result as unknown as [string, bigint] | undefined)?.[1]
            return [ilk, mat ? Math.round((Number(mat) / Number(RAY)) * 100 * 100) / 100 : 0]
        })
    )

    const positions: Position[] = []

    for (const cdp of cdpData) {
        const ilkResult = ilkDataMap.get(cdp.ilkBytes)
        if (!ilkResult) continue

        const { ink, art } = cdp
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
            ownerEoa: cdp.userAddr,
            ilk,
            ilkBytes: cdp.ilkBytes,
            collateralAmount,
            actualDebt,
            collateral: `${collateralAmount.toFixed(2)} ${collateralSymbol}`,
            debt: `$${actualDebt.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
            ratio: Math.round(ratio * 100) / 100,
            liquidationRatio: liquidationRatioMap.get(cdp.ilkBytes) ?? 0,
        })
    }

    return positions
}

const BROWSE_LIMIT = 100
const SEARCH_LIMIT = 20

export async function fetchCdps(
    searchId: string | null,
    collateralFilter: CollateralFilter,
    onProgress?: (message: string) => void,
    limit?: number
): Promise<Position[]> {
    const isSearchMode = !!(searchId || collateralFilter)
    const resultLimit = limit ?? (isSearchMode ? SEARCH_LIMIT : BROWSE_LIMIT)

    onProgress?.('Fetching latest CDP ID...')

    const lastId = await client.readContract({
        address: CDP_MANAGER_ADDRESS,
        abi: CDP_MANAGER_ABI,
        functionName: 'cdpi',
    })

    const targetId = searchId ? BigInt(searchId) : lastId
    const BATCH_SIZE = 50n
    const MAX_RINGS = searchId && collateralFilter ? 50 : 25

    const tasks: (() => Promise<Position[]>)[] = []

    for (let ring = 0; ring < MAX_RINGS; ring++) {
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

        if (lowerIds.length > 0) tasks.push(() => fetchBatch(lowerIds))
        if (upperIds.length > 0) tasks.push(() => fetchBatch(upperIds))

        if (lowerFrom <= 1n && upperTo >= lastId) break
    }

    const CONCURRENCY = 5
    const collected: Position[] = []
    let completedCount = 0

    for (let i = 0; i < tasks.length; i += CONCURRENCY) {
        const wave = tasks.slice(i, i + CONCURRENCY)

        const waveResults = await Promise.all(wave.map((t) => t()))
        completedCount += wave.length

        for (const batchPositions of waveResults) {
            collected.push(...batchPositions)
        }

        const matchingCount = collateralFilter
            ? collected.filter((p) => p.ilk === collateralFilter).length
            : collected.length

        onProgress?.(`Scanned ${completedCount}/${tasks.length} batches, found ${matchingCount} positions...`)

        if (matchingCount >= resultLimit) break
    }

    const result = collateralFilter
        ? collected.filter((p) => p.ilk === collateralFilter)
        : collected

    result.sort((a, b) => {
        const distA = Math.abs(Number(a.id) - Number(targetId))
        const distB = Math.abs(Number(b.id) - Number(targetId))
        return distA - distB
    })

    return result.slice(0, resultLimit)
}

export async function fetchLastCdps(): Promise<Position[]> {
    return fetchCdps(null, null, undefined, 10)
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