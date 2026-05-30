import { StudentSidebar } from './StudentSidebar'
import { StudentHeader } from './StudentHeader'

interface StudentShellProps {
  children: React.ReactNode
  userFullName?: string
  userEmail?: string
  userAvatarUrl?: string
}

export function StudentShell({ children, userFullName, userEmail, userAvatarUrl }: StudentShellProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Sidebar desktop */}
      <div className="hidden lg:flex">
        <StudentSidebar userFullName={userFullName} userEmail={userEmail} userAvatarUrl={userAvatarUrl} />
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <StudentHeader userFullName={userFullName} userEmail={userEmail} userAvatarUrl={userAvatarUrl} />
        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-base)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
