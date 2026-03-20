import { Fragment, useCallback, useMemo, useState, type ReactNode } from 'react'
import { ModalContext, type CustomModalRenderProps, type ModalContextType, type ModalDefinition, type ModalProps } from './modal-context'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '#/shared';

const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modals, setModals] = useState<ModalDefinition[]>([]);

    const openGeneric = useCallback((props: ModalProps) => {
        const id = crypto.randomUUID();
        setModals((prev) => [...prev, { id, open: true, type: 'generic', props }]);
        return id;
    }, []);

    const openCustom = useCallback(
        (render: (props: CustomModalRenderProps) => ReactNode) => {
            const id = crypto.randomUUID();
            setModals((prev) => [
                ...prev,
                { id, open: true, type: 'custom', render }
            ]);

            return id
        },
        [],
    );

    const close = useCallback((id: string) => {
        setModals((prev) =>
            prev.map((modal) =>
                modal.id === id ? { ...modal, open: false } : modal
            )
        );

        setTimeout(() => {
            setModals((prev) => prev.filter((modal) => modal.id !== id));
        }, 150);
    }, []);

    const contextValue: ModalContextType = useMemo(
        () => ({
            openGeneric,
            openCustom,
            close
        }),
        [openGeneric, openCustom, close]
    );

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
            {modals.map((modal) => {
                if (modal.type === "generic") {
                    const {
                        title,
                        description,
                        content,
                        footer,
                        showCloseButton,
                        contentClassName,
                        headerClassName,
                    } = modal.props;
                    return (
                        <Dialog
                            key={modal.id}
                            open={modal.open}
                            onOpenChange={(isOpen) => {
                                if (!isOpen) close(modal.id);
                            }}
                        >
                            <DialogContent
                                className={contentClassName}
                                showCloseButton={showCloseButton}
                            >
                                {(title || description) && (
                                    <DialogHeader className={headerClassName}>
                                        {title && <DialogTitle>{title}</DialogTitle>}
                                        {description && (
                                            <DialogDescription>{description}</DialogDescription>
                                        )}
                                    </DialogHeader>
                                )}
                                {content}
                                {footer && <DialogFooter>{footer}</DialogFooter>}
                            </DialogContent>
                        </Dialog>
                    );
                }

                if (modal.type === "custom") {
                    return (
                        <Fragment key={modal.id}>
                            {modal.render({
                                open: modal.open,
                                onOpenChange: (isOpen) => {
                                    if (!isOpen) close(modal.id);
                                },
                                close: () => close(modal.id),
                            })}
                        </Fragment>
                    );
                }

                return null;
            })}
        </ModalContext.Provider>
    )
}

export default ModalProvider
