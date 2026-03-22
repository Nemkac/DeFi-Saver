import { useState } from 'react'
import { MantineProvider } from '@mantine/core'
import Sidebar from '../widgets/layout/sidebar/sidebar'
import Header from '#/widgets/layout/header/header'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <MantineProvider>
      <div className="flex min-h-screen">
        {/* Overlay — visible below lg when sidebar is open */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <Sidebar open={open} onClose={() => setOpen(false)} />

        <div className="flex flex-col flex-1 lg:ml-60 min-h-screen bg-linear-to-t from-surface-primary to-surface-gradient-end">
          <div className="lg:hidden">
            <Header onMenuToggle={() => setOpen((v) => !v)} />
          </div>
          <main className="flex-1 z-2 py-4">{children}</main>
        </div>
      </div>
    </MantineProvider>
  )
}