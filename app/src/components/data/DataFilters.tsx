import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '../ui/DropdownMenu'
import InputField from '../ui/InputField'

const COLLATERAL_OPTIONS = [
    {
        icon: 'eth.svg',
        id: 'eth',
        title: 'ETH'
    },
    {
        icon: 'usdc.svg',
        id: 'usdc',
        title: 'USDC'
    },
    {
        icon: 'wbtc.png',
        id: 'wbtc',
        title: 'WBTC'
    },
]

const DataFilters = () => {
    const [collateral, setCollateral] = useState<string | null>(null)

    const collateralDrodpownDisplay = (collateral: string | null) => {
        if (!collateral) return 'All';

        const coll = COLLATERAL_OPTIONS.find((co) => co.id === collateral);

        return <div className='flex flex-row items-center gap-1'>
            <img src={coll?.icon} className='size-4' />
            <p className='text-p-md text-primary'>{coll?.title}</p>
        </div>
    }

    return (
        <div className="flex flex-col md:flex-row w-full items-center gap-2 md:gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center w-full justify-between md:w-auto p-4 gap-2 rounded-xl border border-border bg-elevated text-p-md text-primary hover:bg-hover outline-none focus:outline-none transition-colors">
                        <div className='flex flex-row w-full justify-between items-center text-secondary text-p-md-bold gap-6'>
                            Collateral Type:
                            <span className='text-primary'>
                                {collateralDrodpownDisplay(collateral)}
                            </span>
                        </div>
                        <ChevronDown className="size-5 text-secondary" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Collateral Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setCollateral(null)}>
                        All
                    </DropdownMenuItem>
                    {COLLATERAL_OPTIONS.map((option) => (
                        <DropdownMenuItem key={option.id} onSelect={() => setCollateral(option.id)}>
                            <div className='flex flex-row items-center gap-2'>
                                <img src={option.icon} className='size-4' />
                                {option.title}
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <InputField title='CDP ID: ' placeholder='Enter CDP ID' />

        </div>
    )
}

export default DataFilters