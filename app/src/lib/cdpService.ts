import { hexToString } from 'viem'
import { ilkToAsset } from '@defisaver/tokens'
import { client } from './viemClient'
import { CDP_MANAGER_ADDRESS, CDP_MANAGER_ABI, VAT_ABI, VAT_ADDRESS } from './contracts';
import type { Position } from '#/interfaces/position';

export type CollateralFilter = 'ETH-A' | 'WBTC-A' | 'USDC-A' | null

export async function fetchCdps(
    searchId: string | null,
    collateralFilter: CollateralFilter,
    onProgress?: (message: string) => void
): Promise<Position[]> {
    const WAD = 10n ** 18n
    const RAY = 10n ** 27n

    onProgress?.('Fetching latest CPD ID...')
    //Total number of CDPs
    const lastId = await client.readContract({
        address: CDP_MANAGER_ADDRESS,
        abi: CDP_MANAGER_ABI,
        functionName: 'cdpi'
    });

    //Decide which IDs to fetch
    const targetId = searchId ? BigInt(searchId) : lastId
    const half = 100n;
    const from = targetId > half ? targetId - half : 1n;
    const to = targetId + half < lastId ? targetId + half : lastId

    const ids: bigint[] = [];
    for (let i = from; i <= to; i++) {
        ids.push(i);
    }

    onProgress?.('Loading CDP registry data...')
    const managerResults = await client.multicall({
        contracts: ids.flatMap((id) => [
            { address: CDP_MANAGER_ADDRESS, abi: CDP_MANAGER_ABI, functionName: 'owns', args: [id] },
            { address: CDP_MANAGER_ADDRESS, abi: CDP_MANAGER_ABI, functionName: 'ilks', args: [id] },
            { address: CDP_MANAGER_ADDRESS, abi: CDP_MANAGER_ABI, functionName: 'urns', args: [id] }
        ]),
    })

    // Parse manager results - every 3 entries = one CDP
    const cdpData = ids
        .map((id, index) => ({
            id,
            owner: managerResults[index * 3].result as unknown as `0x${string}`,
            ilkBytes: managerResults[index * 3 + 1].result as unknown as `0x${string}`,
            urnAddress: managerResults[index * 3 + 2].result as unknown as `0x${string}`,
        }))
        .filter((c) => c.ilkBytes && c.urnAddress);

    const uniqueIlkBytes = [...new Set(cdpData.map((c) => c.ilkBytes))];

    onProgress?.('Loading vault data...')
    const vatResults = await client.multicall({
        contracts: [
            ...cdpData.map((c) => ({
                address: VAT_ADDRESS,
                abi: VAT_ABI,
                functionName: 'urns' as const,
                args: [c.ilkBytes, c.urnAddress] as [`0x${string}`, `0x${string}`]
            })),
            ...uniqueIlkBytes.map((ilk) => ({
                address: VAT_ADDRESS,
                abi: VAT_ABI,
                functionName: 'ilks' as const,
                args: [ilk] as [`0x${string}`]
            })),
        ],
    });

    onProgress?.('Processing results...')
    const vatUrnResults = vatResults.slice(0, cdpData.length);
    const vatIlkResults = vatResults.slice(cdpData.length);

    const ilkDataMap = new Map(
        uniqueIlkBytes.map((ilk, index) => {
            const res = vatIlkResults[index].result as [bigint, bigint, bigint, bigint, bigint] | undefined
            return [ilk, res]
        })
    )

    const positions: Position[] = [];

    for (let i = 0; i < cdpData.length; i++) {
        const cdp = cdpData[i];
        const urnResult = vatUrnResults[i].result as [bigint, bigint] | undefined;
        const ilkResult = ilkDataMap.get(cdp.ilkBytes);

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

        // Skip dust positions
        if (collateralAmount < 0.001 && actualDebt < 0.01) continue

        const ratio = actualDebt > 0 ? (collateralValueUsd / actualDebt) * 100 : 0
        const ilk = hexToString(cdp.ilkBytes).replace(/\x00/g, '')
        const collateralSymbol = ilkToAsset(ilk)

        positions.push({
            id: cdp.id.toString(),
            owner: cdp.owner,
            collateral: `${collateralAmount.toFixed(2)} ${collateralSymbol}`,
            debt: `$${actualDebt.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
            ratio: Math.round(ratio * 100) / 100,
            ilk
        })
    }

    const filtered = !collateralFilter
        ? positions
        : positions.filter((p) => {
            p.ilk === collateralFilter
        })

    // Sort by proximity to target ID — smallest distance first
    filtered.sort((a, b) => {
        const distA = Math.abs(Number(a.id) - Number(targetId))
        const distB = Math.abs(Number(b.id) - Number(targetId))
        return distA - distB
    })

    return filtered.slice(0, 20)
}