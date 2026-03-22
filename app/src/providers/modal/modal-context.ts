import { createContext, useContext, type ReactNode } from "react";

export type ModalProps = {
    title?: ReactNode;
    description?: ReactNode;
    content: ReactNode;
    footer?: ReactNode;
    showCloseButton?: boolean;
    contentClassName?: string;
    headerClassName?: string;
    onClose?: () => void;
}

export type CustomModalRenderProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    close: () => void;
}

export type ModalDefinition = {
    id: string;
    open: boolean;
} & (
        | { type: 'generic'; props: ModalProps }
        | { type: 'custom'; render: (props: CustomModalRenderProps) => ReactNode }
    );

export type ModalContextType = {
    openGeneric: (props: ModalProps) => string;
    openCustom: (render: (props: CustomModalRenderProps) => ReactNode) => string;
    close: (id: string) => void;
    closeAll: () => void;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }

    return context;
}