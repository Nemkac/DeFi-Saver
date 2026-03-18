import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'mantine-react-table'
import DataTable from '../components/data/DataTable'
import type { Position } from '#/interfaces/position'
import DataCard from '#/components/data/DataCard'
import DataFilters from '#/components/data/DataFilters'

export const Route = createFileRoute('/')({ component: App })

const data: Position[] = [
  { id: '1000', owner: '0xc71332e827eAab4399Ada7C03FA1530BC05C3C83', collateral: '5.10 ETH', debt: '$18,312.00', ratio: 239.23 },
  { id: '1001', owner: '0xc71332e827eAab4399Ada7C03FA1530BC05C3C83', collateral: '5.10 ETH', debt: '$5,000.00', ratio: 239.23 },
  { id: '1002', owner: '0xc71332e827eAab4399Ada7C03FA1530BC05C3C83', collateral: '5.10 USDC', debt: '$21,200.00', ratio: 100.23 },
  { id: '1003', owner: '0xc71332e827eAab4399Ada7C03FA1530BC05C3C83', collateral: '5.10 ETH', debt: '$440.00', ratio: 512.23 },
  { id: '1004', owner: '0xc71332e827eAab4399Ada7C03FA1530BC05C3C83', collateral: '5.10 ETH', debt: '$3,619.00', ratio: 101.23 },
  { id: '1005', owner: '0xc71332e827eAab4399Ada7C03FA1530BC05C3C83', collateral: '5.10 ETH', debt: '$12,000.00', ratio: 101.23 },
  { id: '1006', owner: '0xc71332e827eAab4399Ada7C03FA1530BC05C3C83', collateral: '5.10 USDC', debt: '$8,312.00', ratio: 101.23 },
  { id: '1007', owner: '0xc71332e827eAab4399Ada7C03FA1530BC05C3C83', collateral: '5.10 USDC', debt: '$35,000.00', ratio: 101.23 },
  { id: '1008', owner: '0xc71332e827eAab4399Ada7C03FA1530BC05C3C83', collateral: '5.10 ETH', debt: '$200.00', ratio: 101.23 },
  { id: '1009', owner: '0xc71332e827eAab4399Ada7C03FA1530BC05C3C83', collateral: '5.10 ETH', debt: '$7,440.00', ratio: 101.23 },
  { id: '1010', owner: '0xc71332e827eAab4399Ada7C03FA1530BC05C3C83', collateral: '5.10 ETH', debt: '$3,619.00', ratio: 239.23 },
  { id: '1011', owner: '0xc71332e827eAab4399Ada7C03FA1530BC05C3C83', collateral: '5.10 ETH', debt: '$12,000.00', ratio: 239.23 },
  { id: '1012', owner: '0xc71332e827eAab4399Ada7C03FA1530BC05C3C83', collateral: '5.10 ETH', debt: '$2,000.00', ratio: 239.23 },
]

function App() {
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
          const img = curr === 'ETH' ? 'eth.svg' : 'usdc.svg'
          return (
            <div className="flex flex-row items-center gap-2">
              <span className="text-p-md-bold">{coll.split(' ')[0]}</span>
              <img src={img} alt={curr} />
              {curr}
            </div>
          )
        },
      },
      { accessorKey: 'debt', header: 'Debt', size: 140 },
      {
        accessorKey: 'ratio',
        header: 'Ratio',
        size: 100,
        Cell: ({ cell }) => {
          const ratioValue = cell.getValue<Position['ratio']>()
          const color = ratioValue >= 150 ? 'text-action' : 'text-red-400'
          return <span className={`text-p-md-bold ${color}`}>{ratioValue}%</span>
        },
      },
    ],
    [],
  )

  return (
    <main className="p-6 flex flex-col gap-4">

      <DataFilters />

      <div className="hidden md:block overflow-x-auto min-w-0">
        <DataTable columns={columns} data={data} storageKey="positions-table" />
      </div>

      <div className="flex md:hidden flex-col gap-8">
        {data.map((position) => (
          <DataCard key={position.id} position={position} />
        ))}
      </div>

    </main>
  )
}