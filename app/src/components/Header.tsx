interface HeaderProps {
  title?: string
  onMenuToggle: () => void
}

export default function Header({ title, onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 border-b border-(--line) bg-(--header-bg) backdrop-blur-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-(--sea-ink-soft) hover:bg-(--link-bg-hover) hover:text-(--sea-ink) transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            <line x1="2" y1="4.5" x2="16" y2="4.5" />
            <line x1="2" y1="9" x2="16" y2="9" />
            <line x1="2" y1="13.5" x2="16" y2="13.5" />
          </svg>
        </button>
        <span className="text-sm font-bold text-(--sea-ink)">{title ?? ''}</span>
      </div>
      <div className="flex items-center gap-3">Profile</div>
    </header>
  )
}