import { CdpPositionsPage } from '#/pages/cdp-position/page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cdp-positions')({
    component: CdpPositionsPage,
})
