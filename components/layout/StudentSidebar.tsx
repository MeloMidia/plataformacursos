'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  PlayCircle,
  BookOpen,
  FileText,
  HelpCircle,
  User,
  ChevronRight,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',            label: 'Dashboard',            icon: LayoutDashboard },
  { href: '/continuar-assistindo', label: 'Continuar Assistindo', icon: PlayCircle },
  { href: '/meus-cursos',          label: 'Meus Cursos',          icon: BookOpen },
  { href: '/materiais',            label: 'Materiais',            icon: FileText },
  { href: '/suporte',              label: 'Suporte',              icon: HelpCircle },
]

interface StudentSidebarProps {
  userFullName?: string
  userEmail?: string
  userAvatarUrl?: string
}

const sidebarVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden:  { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
}

export function StudentSidebar({
  userFullName = 'Aluno',
  userEmail = '',
  userAvatarUrl,
}: StudentSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className="flex flex-col h-full w-64 shrink-0"
      style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6" style={{ borderBottom: '1px solid var(--border)' }}>
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm"
          style={{ background: 'var(--blue-primary)', color: '#fff' }}
        >
          P
        </div>
        <span className="font-bold text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Plataforma
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <motion.ul variants={sidebarVariants} initial="hidden" animate="visible" className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <motion.li key={item.href} variants={itemVariants}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-[var(--bg-card)]'
                      : 'hover:bg-[var(--bg-card)]/50'
                  )}
                  style={{
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    ...(isActive ? { boxShadow: 'inset 3px 0 0 var(--blue-primary)' } : {}),
                  }}
                >
                  <Icon size={18} style={{ color: isActive ? 'var(--blue-accent)' : 'var(--text-muted)' }} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto" style={{ color: 'var(--blue-accent)' }} />}
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </nav>

      {/* User Footer */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <Link
          href="/minha-conta"
          className="flex items-center gap-3 px-2 py-2 rounded-lg transition-colors"
          style={{ color: 'inherit' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Avatar className="w-8 h-8 shrink-0">
            {userAvatarUrl && <AvatarImage src={userAvatarUrl} alt={userFullName} />}
            <AvatarFallback
              className="text-xs font-semibold"
              style={{ background: 'var(--bg-card)', color: 'var(--blue-accent)' }}
            >
              {userFullName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{userFullName}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{userEmail}</p>
          </div>
          <User size={14} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
        </Link>
      </div>
    </aside>
  )
}
