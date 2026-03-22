import type { Position } from "#/shared/api/types/position"
import type { MRT_ColumnDef } from "mantine-react-table"
import { useMemo } from "react"

export const useDataTablePageConfig = () => {
    const columns = useMemo<MRT_ColumnDef<Position>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                size: 80,
                Cell: ({ cell }) => {
                    const id = cell.getValue<Position['id']>();
                    return <p className="text-p-md text-on-surface-primary">{id}</p>
                }
            },
            {
                accessorKey: 'owner',
                header: 'Owner',
                size: 320,
                Cell: ({ cell }) => {
                    const owner = cell.getValue<Position['owner']>()
                    return (
                        <div className="flex flex-row items-center gap-2">
                            <img src="20-master.svg" alt="" />
                            <p className="text-p-md text-on-surface-secondary">{owner}</p>
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
                    const [raw, curr] = coll.split(' ')
                    const formatted = (Math.floor(parseFloat(raw) * 100) / 100).toFixed(2)

                    const getIcon = (symbol: string) => {
                        if (['ETH', 'wstETH', 'rETH'].includes(symbol)) return 'eth.svg'
                        if (symbol === 'WBTC') return 'wbtc.png'
                        return 'usdc.svg'
                    }

                    return (
                        <div className="flex flex-row items-center gap-2 justify-end w-full text-end">
                            <span className="text-p-md-bold text-on-surface-primary">{formatted}</span>
                            <div className="flex flex-row items-center gap-1">
                                <img src={getIcon(curr)} alt={curr} className='size-4' />
                                <span className="text-on-surface-secondary">{curr}</span>
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
                    const debt = cell.getValue<Position['debt']>()
                    const numeric = parseFloat(debt.replace(/[$,]/g, ''))
                    const floored = Math.floor(numeric * 100) / 100
                    const formatted = '$' + floored.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

                    return (
                        <div className="flex flex-row justify-end w-full text-end">
                            <span className="text-p-md-bold">{formatted}</span>
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
                    const color = ratioValue >= liquidationRatio ? 'text-light-green' : 'text-light-red'
                    const decimalsColor = ratioValue >= liquidationRatio ? 'text-dark-green' : 'text-dark-red'
                    const formatted = (Math.floor(ratioValue * 100) / 100).toFixed(2)
                    const [whole, decimals] = formatted.split('.')
                    return <p className={`text-p-md ${color}`}>{whole}<span className={decimalsColor}>.{decimals}%</span></p>
                },
            },
        ],
        [],
    )

    return { columns }
}