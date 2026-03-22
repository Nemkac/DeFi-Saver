// Module-level flag: true on every page load/reload, false after the initial
// data fetch completes. Persists in memory across SPA navigations.
export let isFirstLoad = true

export function markFirstLoadDone() {
    isFirstLoad = false
}
