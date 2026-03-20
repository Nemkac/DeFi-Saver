const DashboardHeading = () => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 max-w-6xl items-center md:gap-10 gap-4 w-full'>
            <h2 className='md:col-span-2 text-balance font-bold text-[36px] leading-10 tracking-[-0.53px] bg-linear-to-r from-white via-[#e2e8f0] to-[#90a1b9] bg-clip-text text-transparent'>
                Select a Collateral Type and enter a CDP ID to find matching results.
            </h2>
            <div className="grid grid-cols-2 w-full items-center gap-4 md:gap-8">
                <div className="flex flex-col gap-2">
                    <h3 className="text-h3 text-primary">6,821</h3>
                    <p className="text-p-md text-secondary">Positions</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-h3 text-primary">$ 7.20B</h3>
                    <p className="text-p-md text-secondary">TVL</p>
                </div>
            </div>
        </div>
    )
}

export default DashboardHeading
