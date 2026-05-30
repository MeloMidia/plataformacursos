'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Users, ShoppingCart, Webhook, Package, ChevronRight, Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin',          label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/cursos',   label: 'Cursos',    icon: BookOpen },
  { href: '/admin/alunos',   label: 'Alunos',    icon: Users },
  { href: '/admin/vendas',   label: 'Vendas',    icon: ShoppingCart },
  { href: '/admin/webhooks', label: 'Webhooks',  icon: Webhook },
  { href: '/admin/produtos', label: 'Produtos',  icon: Package },
]

const sidebarVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}
const itemVariants = {
  hidden:  { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
}

export function AdminSidebar() {
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
          style={{ background: 'var(--yellow)', color: 'var(--bg-base)' }}
        >
          A
        </div>
        <div>
          <span className="font-bold text-base tracking-tight block" style={{ color: 'var(--text-primary)' }}>
            Plataforma
          </span>
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{ background: 'var(--yellow-dim)', color: 'var(--yellow)' }}
          >
            Admin
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <motion.ul variants={sidebarVariants} initial="hidden" animate="visible" className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <motion.li key={item.href} variants={itemVariants}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive ? 'bg-[var(--bg-card)]' : 'hover:bg-[var(--bg-card)]/50'
                  )}
                  style={{
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    ...(isActive ? { boxShadow: 'inset 3px 0 0 var(--yellow)' } : {}),
                  }}
                >
                  <Icon size={18} style={{ color: isActive ? 'var(--yellow)' : 'var(--text-muted)' }} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto" style={{ color: 'var(--yellow)' }} />}
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </nav>

      {/* Footer */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 px-2 py-2">
          <Shield size={16} style={{ color: 'var(--yellow)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Área Administrativa</span>
        </div>
      </div>
    </aside>
  )
}
