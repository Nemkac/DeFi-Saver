import { useState } from 'react'
import { MantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'


type ColumnSizing = Record<string, number>

function loadSizing(key: string): ColumnSizing {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

interface DataTableProps<TData extends Record<string, unknown>> {
  columns: MRT_ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
  storageKey?: string
}

export default function DataTable<TData extends Record<string, unknown>>({
  columns,
  data,
  isLoading,
  storageKey = 'mrt-table',
}: DataTableProps<TData>) {
  const [columnSizing, setColumnSizing] = useState<ColumnSizing>(
    () => loadSizing(storageKey),
  )

  function handleColumnSizingChange(
    updater: ColumnSizing | ((prev: ColumnSizing) => ColumnSizing),
  ) {
    setColumnSizing((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem(storageKey, JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="mrt-wrapper">
      <MantineReactTable
        columns={columns}
        data={data}
        state={{ isLoading, columnSizing }}
        onColumnSizingChange={handleColumnSizingChange as any}
        enableColumnResizing
        columnResizeMode="onChange"
        enableColumnActions
        enableDensityToggle
        enableFullScreenToggle
        enableHiding
        enableSorting
        enablePagination
        enableFilters={false}
        mantinePaperProps={{
          sx: {
            backgroundColor: 'var(--table-bg) !important',
            border: '1px solid var(--border) !important',
            borderRadius: '16px !important',
            boxShadow: 'none !important',
            overflow: 'hidden',
          },
        }}
        mantineTopToolbarProps={{
          sx: { backgroundColor: 'var(--table-bg) !important' },
        }}
        mantineBottomToolbarProps={{
          sx: { backgroundColor: 'var(--table-bg) !important' },
        }}
        mantineTableHeadRowProps={{
          sx: { backgroundColor: 'var(--table-bg) !important' },
        }}
        mantineTableHeadCellProps={{
          sx: { backgroundColor: 'var(--table-bg) !important', color: 'var(--table-header-text) !important' },
          className: 'text-p-xsm-bold tracking-widest',
        }}
        mantineTableBodyCellProps={{
          className: 'text-primary',
        }}
        mantineTableBodyRowProps={{
          sx: {
            '& td:first-of-type': {
              boxShadow: 'inset 3px 0 0 transparent',
              transition: 'box-shadow 150ms ease',
            },
            '&:hover td:first-of-type': {
              boxShadow: 'inset 3px 0 0 var(--table-accent)',
            },
            '&:hover': {
              backgroundColor: 'var(--table-hover-bg) !important',
            },
          },
        }}
      />
    </div>
  )
}
