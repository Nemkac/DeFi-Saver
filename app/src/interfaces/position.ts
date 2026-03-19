export interface Position extends Record<string, unknown> {
    id: string
    owner: string
    collateral: string
    debt: string
    ratio: number
    ilk: string
}