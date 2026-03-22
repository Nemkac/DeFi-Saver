import SidebarLogo from './sidebar-logo'
import SidebarNav from './sidebar-nav'

interface SidebarProps {
    open: boolean
    onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    return (
        <aside
            className={[
                'fixed top-0 left-0 h-screen w-60 flex flex-col',
                'border-r border-stroke-primary bg-surface-secondary backdrop-blur-lg z-40',
                'transition-transform duration-250 ease-in-out',
                open ? 'translate-x-0' : '-translate-x-full',
                'lg:translate-x-0',
            ].join(' ')}
        >
            <SidebarLogo />
            <SidebarNav onLinkClick={onClose} />
        </aside>
    )
}