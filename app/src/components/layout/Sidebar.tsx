import { Link } from '@tanstack/react-router'
import ThemeToggle from '../ui/ThemeToggle'

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
        'border-r border-border bg-elevated backdrop-blur-lg z-40',
        'transition-transform duration-250 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0',
      ].join(' ')}
    >
      <div className="px-5 py-5 border-b border-border flex items-center gap-2.5">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path
            d="M14 2.5L24 8.25V19.75L14 25.5L4 19.75V8.25L14 2.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="currentColor"
            fillOpacity="0.1"
            strokeLinejoin="round"
            className="text-action"
          />
          <path
            d="M10 18.5L14 11L18 18.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-action"
          />
        </svg>
        <span className="display-title text-base font-bold text-primary tracking-tight leading-none">
          DeFi<span className="text-action">Saver</span>
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

      <div className="px-5 py-4 border-t border-border">
        <ThemeToggle />
      </div>
    </aside>
  )
}