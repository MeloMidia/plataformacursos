import { AdminSidebar } from './AdminSidebar'

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-secondary)' }}>
        {children}
      </main>
    </div>
  )
}
