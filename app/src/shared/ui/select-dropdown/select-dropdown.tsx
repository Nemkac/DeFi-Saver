import { ChevronDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../dropdown-menu/dropdown-menu'

export type SelectDropdownOption<T extends string> = {
    id: T
    title: string
    icon?: string
}

type SelectDropdownProps<T extends string> = {
    label: string
    value: T | null
    onChange: (value: T | null) => void
    options: SelectDropdownOption<T>[]
    allLabel?: string
}

export function SelectDropdown<T extends string>({
    label,
    value,
    onChange,
    options,
    allLabel = 'All',
}: SelectDropdownProps<T>) {
    const selected = options.find((o) => o.id === value)

    const displayValue = selected ? (
        <div className="flex flex-row items-center gap-1">
            {selected.icon && <img src={selected.icon} className="size-4" />}
            <span className="text-p-md text-primary">{selected.title}</span>
        </div>
    ) : (
        allLabel
    )

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center w-full justify-between md:w-auto p-4 gap-2 rounded-xl border border-border bg-elevated text-p-md text-primary hover:bg-hover outline-none focus:outline-none transition-colors">
                    <div className="flex flex-row w-full justify-between items-center text-secondary text-p-md-bold gap-6">
                        {label}:
                        <span className="text-primary">{displayValue}</span>
                    </div>
                    <ChevronDown className="size-5 text-secondary" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => onChange(null)}>
                    {allLabel}
                </DropdownMenuItem>
                {options.map((option) => (
                    <DropdownMenuItem key={option.id} onSelect={() => onChange(option.id)}>
                        <div className="flex flex-row items-center gap-2">
                            {option.icon && <img src={option.icon} className="size-4" />}
                            {option.title}
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}