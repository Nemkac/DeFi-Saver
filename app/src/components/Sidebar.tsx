import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
] as const

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <aside
      className={[
        'fixed top-0 left-0 h-screen w-60 flex flex-col',
        'border-r border-(--line) bg-(--header-bg) backdrop-blur-lg z-40',
        'transition-transform duration-250 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0',
      ].join(' ')}
    >
      <div className="px-5 py-5 border-b border-(--line)">
        <span className="display-title text-lg font-bold text-(--sea-ink) tracking-tight">
          DeFi Saver
        </span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 p-3">
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="sidebar-link"
            activeProps={{ className: 'sidebar-link is-active' }}
            activeOptions={{ exact: to === '/' }}
            onClick={onClose}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-(--line)">
        <ThemeToggle />
      </div>
    </aside>
  )
}