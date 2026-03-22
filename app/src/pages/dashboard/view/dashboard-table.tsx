import { IconArrowRight } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { fetchLastCdps } from '#/shared/api/cdp/cdp-service'
import { isFirstLoad } from '#/shared/lib/utility-functions/first-load'
import { ModularTable, CdpCardSkeleton } from '#/shared'
import { useDataTablePageConfig } from '#/shared/config/use-data-table-config'
import { useModal } from '#/providers/modal/modal-context'
import { CdpDetailContent } from '#/widgets/cdp/detail/cdp-detail-content'
import DataCard from '#/widgets/cdp/card/cdp-card'
import type { Position } from '#/shared/api/types/position'

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
}

const DashboardTableSection = () => {
    const shouldAnimate = useRef(isFirstLoad).current
    const modal = useModal()
    const { columns } = useDataTablePageConfig()
    const [openModalId, setOpenModalId] = useState<string | null>(null)
    const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null)

    const { data = [], isLoading } = useQuery({
        queryKey: ['cdps-last-10'],
        queryFn: fetchLastCdps,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    })

    const handleRowClick = (row: unknown) => {
        const position = row as Position

        if (openModalId) modal.close(openModalId)

        setHighlightedRowId(position.id)

        const id = modal.openGeneric({
            title: `CDP #${position.id}`,
            content: <CdpDetailContent position={position} />,
            onClose: () => {
                setHighlightedRowId(null)
                setOpenModalId(null)
            },
        })

        setOpenModalId(id)
    }

    return (
        <motion.div
            className='flex flex-col w-full gap-4 md:gap-10 max-w-6xl'
            variants={container}
            initial={shouldAnimate ? 'hidden' : false}
            animate="show"
        >
            <div className='flex flex-col md:flex-row md:justify-between w-full gap-4 md:gap-10'>
                <motion.h3
                    className='text-h3 text-primary font-bold'
                    variants={item}
                >
                    Last 10 CDP Positions
                </motion.h3>

                <motion.div variants={item}>
                    <Link to='/cdp-positions'>
                        <div className='group flex flex-row px-6 py-2 items-center justify-center gap-4 border rounded-md border-table-accent bg-table-hover hover:bg-table-accent transition-[0.5s]'>
                            <p className='text-p-md text-primary'>Search CDP Positions</p>
                            <IconArrowRight className='size-5 group-hover:animate-[bounce-x_0.7s_ease-in-out_infinite]' />
                        </div>
                    </Link>
                </motion.div>
            </div>

            <motion.div className="hidden md:block overflow-x-auto min-w-0" variants={item}>
                <ModularTable
                    columns={columns}
                    isLoading={isLoading}
                    data={data}
                    storageKey="dashboard-positions-table"
                    highlightedRowId={highlightedRowId ?? undefined}
                    onRowClick={handleRowClick}
                    showTopToolbar={false}
                    showPagination={false}
                />
            </motion.div>

            <motion.div className="flex md:hidden flex-col gap-8" variants={item}>
                {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => <CdpCardSkeleton key={i} />)
                    : data.map((position: Position) => (
                        <DataCard key={position.id} position={position} />
                    ))
                }
            </motion.div>
        </motion.div>
    )
}

export default DashboardTableSection
