import { motion } from 'motion/react'
import { animate } from 'motion'
import { useEffect, useRef } from 'react'
import { isFirstLoad } from '#/shared/lib/utility-functions/first-load'

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
}

function CountUp({ value, prefix = '', suffix = '', decimals = 0, shouldAnimate = true }: {
    value: number
    prefix?: string
    suffix?: string
    decimals?: number
    shouldAnimate?: boolean
}) {
    const ref = useRef<HTMLSpanElement>(null)

    const formatted = decimals > 0
        ? `${prefix}${value.toFixed(decimals)}${suffix}`
        : `${prefix}${value.toLocaleString('en-US')}${suffix}`

    useEffect(() => {
        if (!shouldAnimate) return
        const el = ref.current
        if (!el) return
        const controls = animate(0, value, {
            duration: 1.6,
            ease: 'easeOut',
            onUpdate(v) {
                el.textContent = decimals > 0
                    ? `${prefix}${v.toFixed(decimals)}${suffix}`
                    : `${prefix}${Math.round(v).toLocaleString('en-US')}${suffix}`
            },
        })
        return () => controls.stop()
    }, [value, prefix, suffix, decimals, shouldAnimate])

    return <span ref={ref}>{shouldAnimate ? `${prefix}0${suffix}` : formatted}</span>
}

const DashboardHeading = () => {
    const shouldAnimate = useRef(isFirstLoad).current

    return (
        <motion.div
            className='grid grid-cols-1 md:grid-cols-3 max-w-6xl items-center gap-10 w-full'
            variants={container}
            initial={shouldAnimate ? 'hidden' : false}
            animate="show"
        >
            <motion.h2
                className='md:col-span-2 text-balance font-bold text-[36px] leading-10 tracking-[-0.53px] bg-linear-to-r from-white via-[#e2e8f0] to-[#90a1b9] bg-clip-text text-transparent'
                variants={item}
            >
                Select a Collateral Type and enter a CDP ID to find matching results.
            </motion.h2>

            <div className="grid grid-cols-2 w-full items-center gap-4 md:gap-8">
                <motion.div className="flex flex-col gap-2" variants={item}>
                    <h3 className="text-h3 text-on-surface-primary">
                        <CountUp value={6821} shouldAnimate={shouldAnimate} />
                    </h3>
                    <p className="text-p-md text-on-surface-secondary">Positions</p>
                </motion.div>

                <motion.div className="flex flex-col gap-2" variants={item}>
                    <h3 className="text-h3 text-on-surface-primary">
                        $ <CountUp value={7.20} suffix="B" decimals={2} shouldAnimate={shouldAnimate} />
                    </h3>
                    <p className="text-p-md text-on-surface-secondary">TVL</p>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default DashboardHeading
