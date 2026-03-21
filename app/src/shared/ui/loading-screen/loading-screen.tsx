import { motion } from 'motion/react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export function LoadingScreen() {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-page"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' as const } }}
        >
            <DotLottieReact
                src="/defisaver-loading.json"
                loop
                autoplay
                style={{ width: 240, height: 240 }}
            />
        </motion.div>
    )
}
