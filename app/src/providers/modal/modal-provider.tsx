import { Fragment, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocation } from '@tanstack/react-router'
import { ModalContext, type CustomModalRenderProps, type ModalContextType, type ModalDefinition, type ModalProps } from './modal-context'

const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modals, setModals] = useState<ModalDefinition[]>([])

    const openGeneric = useCallback((props: ModalProps) => {
        const id = crypto.randomUUID()
        setModals((prev) => [...prev, { id, open: true, type: 'generic', props }])
        return id
    }, [])

    const openCustom = useCallback(
        (render: (props: CustomModalRenderProps) => ReactNode) => {
            const id = crypto.randomUUID()
            setModals((prev) => [...prev, { id, open: true, type: 'custom', render }])
            return id
        },
        [],
    )

    // Programmatic close — does NOT call onClose. onClose is reserved for explicit user dismissal.
    const close = useCallback((id: string) => {
        setModals((prev) => prev.map((m) => m.id === id ? { ...m, open: false } : m))
    }, [])

    const closeAll = useCallback(() => {
        setModals((prev) => prev.map((m) => ({ ...m, open: false })))
    }, [])

    const { pathname } = useLocation()
    useEffect(() => { closeAll() }, [pathname])

    // Escape key — dismisses the topmost open modal and fires its onClose
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return
            setModals((prev) => {
                const top = [...prev].reverse().find((m) => m.open)
                if (!top) return prev
                if (top.type === 'generic') top.props.onClose?.()
                return prev.map((m) => m.id === top.id ? { ...m, open: false } : m)
            })
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [])

    const contextValue: ModalContextType = useMemo(
        () => ({ openGeneric, openCustom, close, closeAll }),
        [openGeneric, openCustom, close, closeAll],
    )

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
            {modals.map((modal) => {
                if (modal.type === 'generic') {
                    const { title, description, content, footer } = modal.props

                    const handleDismiss = () => {
                        close(modal.id)
                        modal.props.onClose?.()
                    }

                    return (
                        <AnimatePresence
                            key={modal.id}
                            onExitComplete={() =>
                                setModals((prev) => prev.filter((m) => m.id !== modal.id))
                            }
                        >
                            {modal.open && (
                                <motion.div
                                    key="panel"
                                    initial={{ opacity: 0, x: 32 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 32 }}
                                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                    className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col w-full max-w-lg max-h-[85vh] gap-4 overflow-y-auto overflow-x-hidden rounded-xl p-6 bg-surface-secondary border border-stroke-primary text-on-surface-primary shadow-xl"
                                >
                                    {(title || description) && (
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex flex-col gap-1 min-w-0">
                                                {title && (
                                                    <h2 className="text-h6 text-primary wrap-anywhere">{title}</h2>
                                                )}
                                                {description && (
                                                    <p className="text-p-xsm text-secondary truncate">{description}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={handleDismiss}
                                                className="shrink-0 mt-0.5 size-6 flex items-center justify-center rounded-md text-secondary hover:text-primary hover:bg-hover transition-colors"
                                                aria-label="Close"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                    {content}
                                    {footer && (
                                        <div className="-mx-4 -mb-4 flex flex-col items-center gap-2 rounded-b-xl border-t border-border p-4">
                                            {footer}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )
                }

                if (modal.type === 'custom') {
                    return (
                        <Fragment key={modal.id}>
                            {modal.render({
                                open: modal.open,
                                onOpenChange: (isOpen) => { if (!isOpen) close(modal.id) },
                                close: () => close(modal.id),
                            })}
                        </Fragment>
                    )
                }

                return null
            })}
        </ModalContext.Provider>
    )
}

export default ModalProvider