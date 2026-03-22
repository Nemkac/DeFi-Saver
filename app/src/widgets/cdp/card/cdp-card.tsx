import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'motion/react'
import { IconChevronDown } from '@tabler/icons-react'
import type { Position } from '#/shared/api/types/position'
import InfoField from '../../../shared/ui/info-field/info-field'
import { fetchCdpDetail } from '#/shared/api/cdp/cdp-service'

interface DataCardProps {
    position: Position
}

const DataCard = ({ position }: DataCardProps) => {
    const [expanded, setExpanded] = useState(false)

    const currency = position.collateral.split(' ')[1]
    const amount = position.collateral.split(' ')[0]
    const collateralImg = currency === 'ETH' ? 'eth.svg' : 'usdc.svg'
    const ratioColor = position.ratio >= 150 ? 'text-light-green' : 'text-light-red'
    const decimalColor = position.ratio >= 150 ? 'text-dark-green' : 'text-dark-red'

    const { data: cdpDetail, isLoading } = useQuery({
        queryKey: ['cdp-detail', position.ilkBytes],
        queryFn: () => fetchCdpDetail(position.ilkBytes, position.collateralAmount, position.actualDebt),
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: expanded,
    })

    return (
        <div className="flex flex-col w-full max-w-[100vw] gap-3 p-4 rounded-xl border border-stroke-primary bg-surface-secondary">

            <InfoField title="Owner" orientation="col">
                <div className='flex flex-row items-center gap-2'>
                    <img src='20-master.svg' className='size-4' />
                    <p className="truncate block">{position.owner.slice(0, 6)}...{position.owner.slice(-4)}</p>
                </div>
            </InfoField>

            <div className="h-px bg-stroke-primary" />

            <div className="grid grid-cols-2 gap-4">
                <InfoField title="Collateral" orientation="col">
                    <span className="flex items-center gap-1.5">
                        <img src={collateralImg} className="w-4 h-4" alt={currency} />
                        <span className="text-p-md-bold">{amount}</span>
                        <span>{currency}</span>
                    </span>
                </InfoField>

                <InfoField title="Debt" orientation="col">
                    {position.debt}
                </InfoField>

                <InfoField title="Ratio" orientation="col">
                    <span className={`text-p-md-bold ${ratioColor}`}>{position.ratio.toString().split('.')[0]}<span className={decimalColor}>.{position.ratio.toString().split('.')[1]}%</span></span>
                </InfoField>

                <InfoField title="ID" orientation="col">
                    #{position.id}
                </InfoField>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-col gap-3 pt-1">
                            <div className="h-px bg-stroke-primary" />
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="size-4 rounded-full border-2 border-indicator-primary border-t-transparent animate-spin" />
                                    <p className="text-p-sm text-secondary">Loading details...</p>
                                </div>
                            ) : cdpDetail ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoField title="Liq. Ratio" orientation="col">
                                        {cdpDetail.liquidationRatio}%
                                    </InfoField>
                                    <InfoField title="Liq. Price" orientation="col">
                                        ${cdpDetail.liquidationPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                    </InfoField>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setExpanded(prev => !prev)}
                className="flex items-center justify-center gap-1 text-p-sm hover:text-on-surface-primary transition-colors"
            >
                <div className='flex flex-row gap-2 items-center'>
                    <p className='text-p-xs text-on-surface-secondary'>{expanded ? 'Show less' : 'Show more'}</p>
                    <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <IconChevronDown className="size-4" />
                    </motion.div>
                </div>
            </button>

        </div>
    )
}

export default DataCard;
