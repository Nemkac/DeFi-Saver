import { useState } from 'react'
import { MantineProvider } from '@mantine/core'
import Header from './Header'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <MantineProvider>
      <div className="flex min-h-screen">
        {/* Mobile overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <Sidebar open={open} onClose={() => setOpen(false)} />

        <div className="flex flex-col flex-1 lg:ml-60 min-h-screen">
          <Header onMenuToggle={() => setOpen((v) => !v)} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </MantineProvider>
  )
}