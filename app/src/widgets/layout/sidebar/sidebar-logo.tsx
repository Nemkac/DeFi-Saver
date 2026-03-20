export default function SidebarLogo() {
    return (
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
    )
}