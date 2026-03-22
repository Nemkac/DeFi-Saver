import type { Position } from "#/shared/api/types/position"
import type { MRT_ColumnDef } from "mantine-react-table"
import { useMemo } from "react"

export const useDataTablePageConfig = () => {
    const columns = useMemo<MRT_ColumnDef<Position>[]>(
        () => [
            { accessorKey: 'id', header: 'ID', size: 80 },
            {
                accessorKey: 'owner',
                header: 'Owner',
                size: 320,
                Cell: ({ cell }) => {
                    const owner = cell.getValue<Position['owner']>()
                    return (
                        <div className="flex flex-row items-center gap-2">
                            <img src="20-master.svg" alt="" />
                            <p>{owner}</p>
                        </div>
                    )
                },
            },
            {
                accessorKey: 'collateral',
                header: 'Collateral',
                size: 140,
                Cell: ({ cell }) => {
                    const coll = cell.getValue<Position['collateral']>()
                    const curr = coll.split(' ')[1]

                    const getIcon = (symbol: string) => {
                        if (['ETH', 'wstETH', 'rETH'].includes(symbol)) return 'eth.svg'
                        if (symbol === 'WBTC') return 'wbtc.png'
                        return 'usdc.svg'
                    }

                    return (
                        <div className="flex flex-row items-center gap-2 justify-end w-full text-end">
                            <span className="text-p-md-bold">{coll.split(' ')[0]}</span>
                            <div className="flex flex-row items-center gap-1">
                                <img src={getIcon(curr)} alt={curr} className='size-4' />
                                <span className="text-secondary">{curr}</span>
                            </div>
                        </div>
                    )
                },
            },
            {
                accessorKey: 'debt',
                header: 'Debt',
                size: 140,
                Cell: ({ cell }) => {
                    const coll = cell.getValue<Position['debt']>()

                    return (
                        <div className="flex flex-row justify-end w-full text-end">
                            <span className="text-p-md-bold">{coll}</span>
                        </div>
                    )
                },
            },
            {
                accessorKey: 'ratio',
                header: 'Ratio',
                size: 100,
                Cell: ({ cell, row }) => {
                    const ratioValue = cell.getValue<Position['ratio']>()
                    const liquidationRatio = row.original.liquidationRatio
                    const color = ratioValue >= liquidationRatio ? 'text-action' : 'text-red-400'
                    return <span className={`text-p-md-bold ${color}`}>{ratioValue}%</span>
                },
            },
        ],
        [],
    )

    return { columns }
}