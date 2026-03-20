import { Link } from '@tanstack/react-router'

const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/cdp-positions', label: 'CPD Positions' },
] as const

interface SidebarNavProps {
    onLinkClick: () => void
}

export default function SidebarNav({ onLinkClick }: SidebarNavProps) {
    return (
        <nav className="flex-1 flex flex-col gap-1 p-3">
            {navLinks.map(({ to, label }) => (
                <Link
                    key={to}
                    to={to}
                    className="sidebar-link"
                    activeProps={{ className: 'sidebar-link is-active' }}
                    activeOptions={{ exact: to === '/' }}
                    onClick={onLinkClick}
                >
                    {label}
                </Link>
            ))}
        </nav>
    )
}