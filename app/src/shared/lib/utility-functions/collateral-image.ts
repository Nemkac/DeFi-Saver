const collateralImageMap: Record<string, string> = {
    'eth': 'eth.svg',
    'wbtc': 'wbtc.png',
    'usdc': 'usdc.svg'
};

export function getCollateralImage(ilk: string): string | undefined {
    const lowerIlk = ilk.toLowerCase();
    const token = Object.keys(collateralImageMap).find(key => lowerIlk.includes(key));
    return token ? collateralImageMap[token] : undefined
}