import { useEffect, useRef } from 'react'

const visited = new Set<string>()

export function useFirstVisit(key: string): boolean {
    const isFirst = useRef(!visited.has(key))

    useEffect(() => {
        visited.add(key)
    }, [key])

    return isFirst.current
}
