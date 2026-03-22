export interface Position extends Record<string, unknown> {
    id: string
    owner: string
    ownerEoa: string
    collateral: string
    debt: string
    ratio: number
    liquidationRatio: number
    ilk: string
    ilkBytes: string
    collateralAmount: number
    actualDebt: number
}