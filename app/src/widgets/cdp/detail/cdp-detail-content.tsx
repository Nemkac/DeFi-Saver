import { useQuery } from '@tanstack/react-query'
import { fetchCdpDetail } from '#/shared/api/cdp/cdpService'
import InfoField from '#/shared/ui/info-field/info-field'
import type { Position } from '#/shared/api/types/position'

export function CdpDetailContent({ position }: { position: Position }) {
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
