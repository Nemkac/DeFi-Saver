import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { type MRT_ColumnDef } from 'mantine-react-table'
import DataTable from '../components/data/DataTable'
import type { Position } from '#/interfaces/position'
import DataCard from '#/components/data/DataCard'
import DataFilters from '#/components/data/DataFilters'
import { useQuery } from '@tanstack/react-query'
import { fetchCdps, type CollateralFilter } from '#/lib/cdpService'

export const Route = createFileRoute('/')({ component: App })

function App() {

  const [collateral, setCollateral] = useState<string | null>(null);
  const [cdpId, setCdpId] = useState('');
  const [debounceCdpId, setDebounceCdpId] = useState('');
  const [fetchProgress, setFetchProgress] = useState<string | null>(null);

  // Debounce for 500ms
  useEffect(() => {
    const timer = setTimeout(() => setDebounceCdpId(cdpId), 500)
    return () => clearTimeout(timer);
  }, [cdpId]);

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ['cdps', debounceCdpId, collateral],
    queryFn: () => fetchCdps(debounceCdpId || null, collateral as CollateralFilter, setFetchProgress),
    staleTime: 30_000,
  })

  if (isError) console.error("CDP fetch error: ", error);

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

      <DataFilters
        collateral={collateral}
        onCollateralChange={setCollateral}
        cdpId={cdpId}
        onCdpIdChange={setCdpId}
      />
      {isLoading && fetchProgress && (
        <div className="flex items-center gap-3 px-1">
          <div className="size-4 rounded-full border-2 border-action border-t-transparent animate-spin" />
          <p className="text-p-sm text-secondary">{fetchProgress}</p>
        </div>
      )}
      <div className="hidden md:block overflow-x-auto min-w-0">
        <DataTable columns={columns} isLoading={isLoading} data={data} storageKey="positions-table" />
      </div>

      <div className="flex md:hidden flex-col gap-8">
        {data.map((position) => (
          <DataCard key={position.id} position={position} />
        ))}
      </div>

    </main>
  )
}