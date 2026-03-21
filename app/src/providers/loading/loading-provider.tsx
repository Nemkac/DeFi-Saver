import { useState, useEffect, useRef } from 'react'
import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence } from 'motion/react'
import { LoadingScreen } from '#/shared/ui/loading-screen/loading-screen'
import { markFirstLoadDone, isFirstLoad } from '#/shared/lib/first-load'
import { fetchLastCdps } from '#/shared/api/cdp/cdpService'

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient()
    const isFetching = useIsFetching()

    // Capture at mount time — true on every page reload, false on SPA navigation
    const [isGlobalLoad] = useState(() => isFirstLoad)
    const [appReady, setAppReady] = useState(!isGlobalLoad)
    const hasStartedFetching = useRef(false)

    // Kick off the data fetch so useIsFetching picks it up
    useEffect(() => {
        if (!isGlobalLoad) return
        queryClient.prefetchQuery({
            queryKey: ['cdps-last-10'],
            queryFn: fetchLastCdps,
            staleTime: 30_000,
        })
    }, [queryClient, isGlobalLoad])

    useEffect(() => {
        if (!isGlobalLoad) return
        if (isFetching > 0) hasStartedFetching.current = true
    }, [isFetching, isGlobalLoad])

    useEffect(() => {
        if (!isGlobalLoad) return
        if (hasStartedFetching.current && isFetching === 0) {
            setAppReady(true)
        }
    }, [isFetching, isGlobalLoad])

    return (
        <>
            <AnimatePresence onExitComplete={markFirstLoadDone}>
                {!appReady && <LoadingScreen key="loading" />}
            </AnimatePresence>
            {appReady && children}
        </>
    )
}
