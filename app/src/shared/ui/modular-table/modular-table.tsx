import { useState } from 'react'
import ModularTableImpl, { type ModularTableProps } from './modular-table-impl'

type ColumnSizing = Record<string, number>

function loadSizing(key: string): ColumnSizing {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

function ModularTable<TData extends Record<string, unknown>>(props: ModularTableProps<TData>) {
    const { storageKey = 'mrt-table' } = props

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
        <ModularTableImpl
            {...props}
            columnSizing={columnSizing}
            onColumnSizingChange={handleColumnSizingChange}
        />
    )
}

export default ModularTable