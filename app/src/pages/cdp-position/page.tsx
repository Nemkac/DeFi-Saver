import { useEffect, useState } from 'react'
import { ModularTable, CdpCardSkeleton } from '#/shared'
import type { Position } from '#/shared/api/types/position'
import DataCard from '#/widgets/cdp/card/cdp-card'
import DataFilters from '#/widgets/cdp/filters/cdp-filters-section'
import { useQuery } from '@tanstack/react-query'
import { fetchCdps, type CollateralFilter } from '#/shared/api/cdp/cdp-service'
import { useModal } from '#/providers/modal/modal-context'
import { useDataTablePageConfig } from '#/shared/config/use-data-table-config'
import { CdpDetailContent } from '#/widgets/cdp/detail/cdp-detail-content'

export function CdpPositionsPage() {
    const modal = useModal()

    const [collateral, setCollateral] = useState<string | null>(null);
    const [cdpId, setCdpId] = useState('');
    const [debounceCdpId, setDebounceCdpId] = useState('');
    const [fetchProgress, setFetchProgress] = useState<string | null>(null);
    const [openModalId, setOpenModalId] = useState<string | null>(null);
    const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);

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

    const tableLabel = isLoading ? undefined : (() => {
        const count = data.length
        if (collateral && debounceCdpId) return `Showing ${count} ${collateral} CDP positions closest to #${debounceCdpId}`
        if (collateral) return `Showing last ${count} ${collateral} CDP positions`
        if (debounceCdpId) return `Showing ${count} CDP positions closest to #${debounceCdpId}`
        return `Showing total of ${count} CDP positions`
    })()

    if (isError) console.error("CDP fetch error: ", error);

    const handleRowClick = (row: unknown) => {
        const position = row as Position

        if (openModalId) modal.close(openModalId)

        setHighlightedRowId(position.id)

        const id = modal.openGeneric({
            title: `CDP #${position.id}`,
            content: (<CdpDetailContent position={position} />),
            onClose: () => {
                setHighlightedRowId(null)
                setOpenModalId(null)
            },
        })

        setOpenModalId(id)
    }

    return (
        <main className="p-6 flex flex-col gap-8">

            <div className='flex flex-col md:flex-row w-full md:items-center gap-4'>
                <DataFilters
                    collateral={collateral}
                    onCollateralChange={setCollateral}
                    cdpId={cdpId}
                    onCdpIdChange={setCdpId}
                    countLabel={tableLabel}
                />
            </div>

            <div className="hidden md:block overflow-x-auto min-w-0">
                <ModularTable
                    columns={columns}
                    isLoading={isLoading}
                    loadingText={fetchProgress ?? undefined}
                    label={tableLabel}
                    highlightedRowId={highlightedRowId ?? undefined}
                    data={data}
                    storageKey="positions-table"
                    onRowClick={handleRowClick}
                />
            </div>

            <div className="flex md:hidden flex-col gap-8">
                {isLoading
                    ? (
                        <>
                            {fetchProgress && (
                                <p className="text-p-sm text-secondary">{fetchProgress}</p>
                            )}
                            {Array.from({ length: 3 }).map((_, i) => <CdpCardSkeleton key={i} />)}
                        </>
                    )
                    : data.map((position) => (
                        <DataCard key={position.id} position={position} />
                    ))
                }
            </div>

        </main>
    )
}