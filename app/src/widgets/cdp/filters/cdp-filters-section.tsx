import InputField from '../../../shared/ui/input/input-field'
import { SelectDropdown } from '#/shared'
import type { SelectDropdownOption } from '#/shared'

const COLLATERAL_OPTIONS: SelectDropdownOption<'ETH-A' | 'WBTC-A' | 'USDC-A'>[] = [
    { icon: 'eth.svg', id: 'ETH-A', title: 'ETH-A' },
    { icon: 'wbtc.png', id: 'WBTC-A', title: 'WBTC-A' },
    { icon: 'usdc.svg', id: 'USDC-A', title: 'USDC-A' },
]

type DataFiltersProps = {
    collateral: string | null
    onCollateralChange: (value: string | null) => void
    cdpId: string
    onCdpIdChange: (value: string) => void
}

const DataFilters = ({ ...props }: DataFiltersProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 w-full items-center gap-2 md:gap-4">
            <SelectDropdown
                label="Collateral Type"
                value={props.collateral as 'ETH-A' | 'WBTC-A' | 'USDC-A' | null}
                onChange={props.onCollateralChange}
                options={COLLATERAL_OPTIONS}
            />
            <InputField title='CDP ID: ' placeholder='Enter CDP ID' value={props.cdpId} onChange={props.onCdpIdChange} />
        </div>
    )
}

export default DataFilters