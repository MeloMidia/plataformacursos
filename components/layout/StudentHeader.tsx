'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { StudentSidebar } from './StudentSidebar'

interface StudentHeaderProps {
  userFullName?: string
  userEmail?: string
  userAvatarUrl?: string
}

export function StudentHeader({ userFullName, userEmail, userAvatarUrl }: StudentHeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="flex items-center h-14 px-4 lg:hidden"
      style={{ background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border)' }}
    >
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" style={{ color: 'var(--text-muted)' }}>
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-64"
          style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}
        >
          <StudentSidebar
            userFullName={userFullName}
            userEmail={userEmail}
            userAvatarUrl={userAvatarUrl}
          />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2 ml-3">
        <div
          className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs"
          style={{ background: 'var(--blue-primary)', color: '#fff' }}
        >
          P
        </div>
        <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Plataforma</span>
      </div>
    </header>
  )
}
