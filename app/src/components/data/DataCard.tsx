import type { Position } from '#/interfaces/position'
import InfoField from '../ui/InfoField'

interface DataCardProps {
    position: Position
}

const DataCard = ({ position }: DataCardProps) => {
    const currency = position.collateral.split(' ')[1]
    const amount = position.collateral.split(' ')[0]
    const collateralImg = currency === 'ETH' ? 'eth.svg' : 'usdc.svg'
    const ratioColor = position.ratio >= 150 ? 'text-action' : 'text-red-400'

    return (
        <div className="flex flex-col w-full max-w-[100vw] gap-3 p-4 rounded-xl border border-border bg-elevated">

            <InfoField title="Owner" orientation="col">
                <div className='flex flex-row items-center gap-2'>
                    <img src='20-master.svg' />
                    <p className="truncate block">{position.owner}</p>
                </div>
            </InfoField>

            <div className="h-px bg-border" />

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
                    <span className={`text-p-md-bold ${ratioColor}`}>{position.ratio}%</span>
                </InfoField>

                <InfoField title="ID" orientation="col">
                    #{position.id}
                </InfoField>
            </div>

        </div>
    )
}

export default DataCard;