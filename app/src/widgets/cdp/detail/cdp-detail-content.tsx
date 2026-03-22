import { useQuery } from '@tanstack/react-query'
import { fetchCdpDetail } from '#/shared/api/cdp/cdp-service'
import InfoField from '#/shared/ui/info-field/info-field'
import type { Position } from '#/shared/api/types/position'
import { getCollateralImage } from '#/shared/lib/utility-functions/collateral-image'
import { IconExternalLink } from '@tabler/icons-react'

export function CdpDetailContent({ position }: { position: Position }) {
    const { data: cdpDetail, isLoading, isError } = useQuery({
        queryKey: ['cdp-detail', position.ilkBytes],
        queryFn: () => fetchCdpDetail(position.ilkBytes, position.collateralAmount, position.actualDebt),
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
    })

    const liquidationRatio = position.liquidationRatio
    const color = position.ratio >= liquidationRatio ? 'text-action' : 'text-red-400'

    return (
        <div className="flex flex-col gap-3">
            <InfoField title='Owner'>
                <a href={`https://app.defisaver.com/makerdao/manage?trackAddress=${position.ownerEoa}`} target="_blank" rel="noreferrer">
                    <div className='flex flex-row underline hover:text-action-hover gap-2 items-center'>
                        <img src='20-master.svg' className='size-3' />
                        {`${position.owner.slice(0, 6)}...${position.owner.slice(-4)}`}
                        <IconExternalLink className='size-4' />
                    </div>
                </a>
            </InfoField>
            <InfoField title="Vault">{position.ilk}</InfoField>
            <InfoField title="Collateral">
                <div className='flex flex-row gap-2 items-center'>
                    <img src={getCollateralImage(position.ilk)} />
                    {position.collateral}
                </div>
            </InfoField>
            <InfoField title="Debt">{position.debt}</InfoField>
            <InfoField title="Ratio"><p className={`text-p-md ${color}`}>{position.ratio}%</p></InfoField>

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
