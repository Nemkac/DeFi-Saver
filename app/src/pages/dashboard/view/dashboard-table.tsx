import { IconArrowRight } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

const DashboardTableSection = () => {
    return (
        <div className='flex flex-col w-full gap-4 md:gap-10 max-w-6xl'>
            <div className='flex flex-col md:flex-row md:justify-between w-full gap-4 md:gap-10'>
                <h3 className='text-h3 text-primary font-bold'>
                    Last 10 CDP Positions
                </h3>
                <Link to='/cdp-positions'>
                    <div className='group flex flex-row px-6 py-2 items-center justify-center gap-4 border rounded-md border-table-accent bg-table-hover hover:bg-table-accent transition-[0.5s]'>
                        <p className='text-p-md text-primary'>Search CDP Positions</p>
                        <IconArrowRight className='size-5 group-hover:animate-[bounce-x_0.7s_ease-in-out_infinite]' />
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default DashboardTableSection
