export default function SidebarLogo() {
    return (
        <div className="px-5 py-5 border-b border-stroke-primary flex items-center gap-2.5">
            <img src="DeFiSaver.png" className="size-8" />
            <span className="text-p-lg-bold text-on-surface-primary tracking-tight leading-none">
                DeFi<span className="text-p-lg ml-1">Saver</span>
            </span>
        </div>
    )
}