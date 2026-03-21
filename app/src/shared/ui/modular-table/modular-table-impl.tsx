import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'
import './modular-table.css'

type ColumnSizing = Record<string, number>

export type ModularTableProps<TData extends Record<string, unknown>> = {
    columns: MRT_ColumnDef<TData>[]
    data: TData[]
    isLoading?: boolean
    storageKey?: string
    loadingText?: string
    onRowClick?: (row: TData) => void
    showTopToolbar?: boolean
    showPagination?: boolean
    showDensityToggle?: boolean
    showFullScreenToggle?: boolean
    showColumnVisibility?: boolean
}

type ModularTableImplProps<TData extends Record<string, unknown>> = ModularTableProps<TData> & {
    columnSizing: ColumnSizing
    onColumnSizingChange: (updater: ColumnSizing | ((prev: ColumnSizing) => ColumnSizing)) => void
}

function ModularTableImpl<TData extends Record<string, unknown>>({
    columns,
    data,
    isLoading,
    loadingText,
    onRowClick,
    columnSizing,
    onColumnSizingChange,
    showTopToolbar = true,
    showPagination = true,
    showDensityToggle = true,
    showFullScreenToggle = true,
    showColumnVisibility = true,
}: ModularTableImplProps<TData>) {
    const table = useMantineReactTable({
        columns,
        data,
        state: { isLoading, columnSizing },
        onColumnSizingChange: onColumnSizingChange as any,
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        enableColumnActions: true,
        enableDensityToggle: showDensityToggle,
        enableFullScreenToggle: showFullScreenToggle,
        enableHiding: showColumnVisibility,
        enableSorting: true,
        enablePagination: showPagination,
        enableBottomToolbar: showPagination,
        enableTopToolbar: showTopToolbar,
        enableFilters: false,
        mantineLoadingOverlayProps: {
            overlayColor: 'var(--table-bg)',
            overlayOpacity: 0.95,
            loader: (
                <div className="flex flex-col items-center gap-3">
                    <div className="size-8 rounded-full border-2 border-table-accent border-t-transparent animate-spin" />
                    {loadingText && (
                        <p className="text-p-sm text-secondary">{loadingText}</p>
                    )}
                </div>
            ),
        },
        mantinePaperProps: {
            sx: {
                backgroundColor: 'var(--table-bg) !important',
                border: '1px solid var(--border) !important',
                borderRadius: '16px !important',
                boxShadow: 'none !important',
                overflow: 'hidden',
            },
        },
        mantineTopToolbarProps: {
            sx: { backgroundColor: 'var(--table-bg) !important' },
        },
        mantineBottomToolbarProps: {
            sx: { backgroundColor: 'var(--table-bg) !important' },
        },
        mantineTableHeadRowProps: {
            sx: { backgroundColor: 'var(--table-bg) !important' },
        },
        mantineTableHeadCellProps: {
            sx: { backgroundColor: 'var(--table-bg) !important', color: 'var(--table-header-text) !important' },
            className: 'text-p-md',
        },
        mantineTableBodyCellProps: {
            className: 'text-primary',
        },
        mantineTableBodyRowProps: ({ row }) => ({
            onClick: () => onRowClick?.(row.original),
            style: { cursor: onRowClick ? 'pointer' : undefined },
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
        }),
    })

    return (
        <div className="mrt-wrapper">
            <MantineReactTable table={table} />
        </div>
    )
}

export default ModularTableImpl