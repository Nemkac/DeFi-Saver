export function CdpCardSkeleton() {
    return (
        <div className="flex flex-col w-full gap-3 p-4 rounded-xl border border-stroke-primary bg-surface-secondary animate-pulse">
            <div className="h-4 w-1/2 rounded bg-stroke-primary" />
            <div className="h-px bg-stroke-primary" />
            <div className="grid grid-cols-2 gap-4">
                <div className="h-4 w-3/4 rounded bg-stroke-primary" />
                <div className="h-4 w-3/4 rounded bg-stroke-primary" />
                <div className="h-4 w-1/2 rounded bg-stroke-primary" />
                <div className="h-4 w-1/2 rounded bg-stroke-primary" />
            </div>
        </div>
    )
}