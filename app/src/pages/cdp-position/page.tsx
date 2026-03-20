import { useEffect } from 'react'
import { useState } from 'react'
import { ModularTable } from '#/shared'
import type { Position } from '#/shared/api/types/position'
import DataCard from '#/widgets/cdp/card/cdp-card'
import DataFilters from '#/widgets/cdp/filters/cdp-filters-section'
import { useQuery } from '@tanstack/react-query'
import { fetchCdpDetail, fetchCdps, type CollateralFilter } from '#/lib/cdpService'
import { useModal } from '#/providers/modal/modal-context'
import InfoField from '#/shared/ui/info-field/info-field'
import { useDataTablePageConfig } from '#/shared/config/use-data-table-config'

function CdpDetailContent({ position }: { position: Position }) {
    const { data: cdpDetail, isLoading, isError } = useQuery({
        queryKey: ['cdp-detail', position.ilkBytes],
        queryFn: () => fetchCdpDetail(position.ilkBytes, position.collateralAmount, position.actualDebt),
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
    })

    return (
        <div className="flex flex-col gap-3">
            <InfoField title="Vault">{position.ilk}</InfoField>
            <InfoField title="Collateral">{position.collateral}</InfoField>
            <InfoField title="Debt">{position.debt}</InfoField>
            <InfoField title="Ratio">{position.ratio}%</InfoField>

            {isLoading && (
                <div className="flex items-center gap-2 pt-2">
                    <div className="size-4 rounded-full border-2 border-action border-t-transparent animate-spin" />
                    <p className="text-p-sm text-secondary">Loading vault details...</p>
                </div>
            )}
            {isError && (
                <p className="text-p-sm text-red-400">Failed to load vault details</p>
            )}

            {cdpDetail && (
                <>
                    <div className="my-1 h-px bg-border" />
                    <InfoField title="Liquidation Ratio">{cdpDetail.liquidationRatio}%</InfoField>
                    <InfoField title="Liquidation Price">${cdpDetail.liquidationPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}</InfoField>
                </>
            )}
        </div>
    )
}

export function CdpPositionsPage() {
    const modal = useModal()

    const [collateral, setCollateral] = useState<string | null>(null);
    const [cdpId, setCdpId] = useState('');
    const [debounceCdpId, setDebounceCdpId] = useState('');
    const [fetchProgress, setFetchProgress] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebounceCdpId(cdpId), 500)
        return () => clearTimeout(timer);
    }, [cdpId]);

    const { data = [], isLoading, isError, error } = useQuery({
        queryKey: ['cdps', debounceCdpId, collateral],
        queryFn: () => fetchCdps(debounceCdpId || null, collateral as CollateralFilter, setFetchProgress),
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    })

    const { columns } = useDataTablePageConfig();

    if (isError) console.error("CDP fetch error: ", error);

    const handleRowClick = (row: unknown) => {
        const position = row as Position
        modal.openGeneric({
            title: `CDP #${position.id}`,
            description: position.owner,
            content: (
                <>
                    <div className="h-px bg-border" />
                    <CdpDetailContent position={position} />
                </>
            ),
        })
    }

    return (
        <main className="p-6 flex flex-col gap-4">

            <DataFilters
                collateral={collateral}
                onCollateralChange={setCollateral}
                cdpId={cdpId}
                onCdpIdChange={setCdpId}
            />

            <div className="hidden md:block overflow-x-auto min-w-0">
                <ModularTable
                    columns={columns}
                    isLoading={isLoading}
                    loadingText={fetchProgress ?? undefined}
                    data={data}
                    storageKey="positions-table"
                    onRowClick={handleRowClick}
                />
            </div>

            <div className="flex md:hidden flex-col gap-8">
                {data.map((position) => (
                    <DataCard key={position.id} position={position} />
                ))}
            </div>

        </main>
    )
}
