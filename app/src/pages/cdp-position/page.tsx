import { useEffect } from 'react'
import { useState } from 'react'
import { ModularTable } from '#/shared'
import type { Position } from '#/shared/api/types/position'
import DataCard from '#/widgets/cdp/card/cdp-card'
import DataFilters from '#/widgets/cdp/filters/cdp-filters-section'
import { useQuery } from '@tanstack/react-query'
import { fetchCdps, type CollateralFilter } from '#/shared/api/cdp/cdpService'
import { useModal } from '#/providers/modal/modal-context'
import { useDataTablePageConfig } from '#/shared/config/use-data-table-config'
import { CdpDetailContent } from '#/widgets/cdp/detail/cdp-detail-content'

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
