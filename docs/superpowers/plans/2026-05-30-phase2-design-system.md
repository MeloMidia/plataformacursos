# Fase 2 — Design System e Layout Base — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o shell visual completo da plataforma — StudentSidebar, StudentShell, AdminSidebar, AdminShell, todos os layouts de grupo de rotas — com design premium dark azul/amarelo, responsivo, com animações Framer Motion. Sem dados reais; apenas estrutura visual navegável.

**Architecture:** Componentes de layout isolados em `components/layout/`. Cada shell recebe `children` e injeta o frame visual. Sidebar usa `sheet` do Shadcn em mobile. Framer Motion para entrada de página e stagger de items. Nenhum dado do Supabase nesta fase.

**Tech Stack:** Next.js App Router, TailwindCSS (tokens do design system da Fase 1), Shadcn/UI (Sheet, Avatar, Separator, ScrollArea), Framer Motion, Lucide React.

**Pré-requisito:** Fase 1 completa e verificada.

---

## File Map

```
components/
├── layout/
│   ├── StudentSidebar.tsx          # sidebar fixa da área do aluno
│   ├── StudentShell.tsx            # wrapper: sidebar + main content
│   ├── StudentHeader.tsx           # header mobile + breadcrumb
│   ├── AdminSidebar.tsx            # sidebar da área admin
│   └── AdminShell.tsx              # wrapper: sidebar + main content (admin)
├── ui/
│   └── (componentes Shadcn já instalados na Fase 1)
app/
├── (student)/
│   └── layout.tsx                  # usa StudentShell (substituir placeholder)
└── (admin)/
    └── layout.tsx                  # usa AdminShell (substituir placeholder)
```

---

## Task 1: StudentSidebar

**Files:**
- Create: `components/layout/StudentSidebar.tsx`

- [ ] **Step 1.1: Criar `components/layout/StudentSidebar.tsx`**

```typescript
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
  { href: '/dashboard',              label: 'Dashboard',           icon: LayoutDashboard },
  { href: '/continuar-assistindo',   label: 'Continuar Assistindo',icon: PlayCircle },
  { href: '/meus-cursos',            label: 'Meus Cursos',         icon: BookOpen },
  { href: '/materiais',              label: 'Materiais',           icon: FileText },
  { href: '/suporte',                label: 'Suporte',             icon: HelpCircle },
]

interface StudentSidebarProps {
  userFullName?: string
  userEmail?: string
  userAvatarUrl?: string
}

const sidebarVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
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
      style={{
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[var(--border)]">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm"
          style={{ background: 'var(--blue-primary)', color: '#fff' }}
        >
          P
        </div>
        <span className="font-bold text-base text-[var(--text-primary)] tracking-tight">
          Plataforma
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <motion.ul
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          className="space-y-1"
        >
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
                      ? 'text-[var(--text-primary)] bg-[var(--bg-card)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)]/50'
                  )}
                  style={
                    isActive
                      ? { boxShadow: 'inset 3px 0 0 var(--blue-primary)' }
                      : undefined
                  }
                >
                  <Icon
                    size={18}
                    className={cn(
                      isActive
                        ? 'text-[var(--blue-accent)]'
                        : 'text-[var(--text-muted)]'
                    )}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <ChevronRight size={14} className="ml-auto text-[var(--blue-accent)]" />
                  )}
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-[var(--border)]">
        <Link
          href="/minha-conta"
          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors"
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
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
              {userFullName}
            </p>
            <p className="text-xs text-[var(--text-muted)] truncate">{userEmail}</p>
          </div>
          <User size={14} className="text-[var(--text-muted)] shrink-0" />
        </Link>
      </div>
    </aside>
  )
}
```

- [ ] **Step 1.2: Commit**

```bash
git add components/layout/StudentSidebar.tsx
git commit -m "feat: StudentSidebar — dark premium with active state and user footer"
```

---

## Task 2: StudentShell e StudentHeader

**Files:**
- Create: `components/layout/StudentHeader.tsx`
- Create: `components/layout/StudentShell.tsx`

- [ ] **Step 2.1: Criar `components/layout/StudentHeader.tsx`**

```typescript
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

export function StudentHeader({
  userFullName,
  userEmail,
  userAvatarUrl,
}: StudentHeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="flex items-center h-14 px-4 border-b lg:hidden"
      style={{
        background: 'var(--bg-sidebar)',
        borderColor: 'var(--border)',
      }}
    >
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-64 border-r border-[var(--border)]"
          style={{ background: 'var(--bg-sidebar)' }}
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
        <span className="font-bold text-sm text-[var(--text-primary)]">
          Plataforma
        </span>
      </div>
    </header>
  )
}
```

- [ ] **Step 2.2: Criar `components/layout/StudentShell.tsx`**

```typescript
import { StudentSidebar } from './StudentSidebar'
import { StudentHeader } from './StudentHeader'

interface StudentShellProps {
  children: React.ReactNode
  userFullName?: string
  userEmail?: string
  userAvatarUrl?: string
}

export function StudentShell({
  children,
  userFullName,
  userEmail,
  userAvatarUrl,
}: StudentShellProps) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Sidebar — desktop only */}
      <div className="hidden lg:flex">
        <StudentSidebar
          userFullName={userFullName}
          userEmail={userEmail}
          userAvatarUrl={userAvatarUrl}
        />
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header — mobile only */}
        <StudentHeader
          userFullName={userFullName}
          userEmail={userEmail}
          userAvatarUrl={userAvatarUrl}
        />

        {/* Content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: 'var(--bg-base)' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2.3: Atualizar `app/(student)/layout.tsx`**

```typescript
import { StudentShell } from '@/components/layout/StudentShell'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StudentShell
      userFullName="Aluno Teste"
      userEmail="aluno@exemplo.com"
    >
      {children}
    </StudentShell>
  )
}
```

- [ ] **Step 2.4: Verificar visualmente**

```bash
npm run dev
```

Fazer login (ou temporariamente remover redirect do middleware para `/dashboard`).
Visitar `http://localhost:3000/dashboard`:
- Desktop: sidebar fixa à esquerda com fundo `#060A13`, logo, nav, avatar no rodapé
- Mobile: header com hamburger, sheet abre a sidebar

- [ ] **Step 2.5: Commit**

```bash
git add components/layout/StudentShell.tsx components/layout/StudentHeader.tsx app/(student)/layout.tsx
git commit -m "feat: StudentShell with responsive sidebar — desktop fixed, mobile drawer"
```

---

## Task 3: AdminSidebar e AdminShell

**Files:**
- Create: `components/layout/AdminSidebar.tsx`
- Create: `components/layout/AdminShell.tsx`
- Modify: `app/(admin)/layout.tsx`

- [ ] **Step 3.1: Criar `components/layout/AdminSidebar.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ShoppingCart,
  Webhook,
  Package,
  ChevronRight,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin',          label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { href: '/admin/cursos',   label: 'Cursos',     icon: BookOpen },
  { href: '/admin/alunos',   label: 'Alunos',     icon: Users },
  { href: '/admin/vendas',   label: 'Vendas',     icon: ShoppingCart },
  { href: '/admin/webhooks', label: 'Webhooks',   icon: Webhook },
  { href: '/admin/produtos', label: 'Produtos',   icon: Package },
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
      style={{
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo + Badge Admin */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[var(--border)]">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm"
          style={{ background: 'var(--yellow)', color: 'var(--bg-base)' }}
        >
          A
        </div>
        <div>
          <span className="font-bold text-base text-[var(--text-primary)] tracking-tight block">
            Plataforma
          </span>
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{
              background: 'var(--yellow-dim)',
              color: 'var(--yellow)',
            }}
          >
            Admin
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <motion.ul
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          className="space-y-1"
        >
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <motion.li key={item.href} variants={itemVariants}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'text-[var(--text-primary)] bg-[var(--bg-card)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)]/50'
                  )}
                  style={
                    isActive
                      ? { boxShadow: 'inset 3px 0 0 var(--yellow)' }
                      : undefined
                  }
                >
                  <Icon
                    size={18}
                    className={cn(
                      isActive ? 'text-[var(--yellow)]' : 'text-[var(--text-muted)]'
                    )}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <ChevronRight size={14} className="ml-auto text-[var(--yellow)]" />
                  )}
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-2 px-2 py-2">
          <Shield size={16} className="text-[var(--yellow)]" />
          <span className="text-xs text-[var(--text-muted)]">Área Administrativa</span>
        </div>
      </div>
    </aside>
  )
}
```

- [ ] **Step 3.2: Criar `components/layout/AdminShell.tsx`**

```typescript
import { AdminSidebar } from './AdminSidebar'

interface AdminShellProps {
  children: React.ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      <AdminSidebar />
      <main
        className="flex-1 overflow-y-auto"
        style={{ background: 'var(--bg-secondary)' }}
      >
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 3.3: Atualizar `app/(admin)/layout.tsx`**

```typescript
import { AdminShell } from '@/components/layout/AdminShell'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminShell>{children}</AdminShell>
}
```

- [ ] **Step 3.4: Verificar visualmente**

Visitar `http://localhost:3000/admin`:
- Sidebar com logo amarelo, badge "Admin", nav com ícones amarelos no item ativo
- Clicar entre `/admin/cursos`, `/admin/alunos` — sidebar ativa o item correto

- [ ] **Step 3.5: Commit**

```bash
git add components/layout/AdminSidebar.tsx components/layout/AdminShell.tsx app/(admin)/layout.tsx
git commit -m "feat: AdminShell with yellow accent sidebar for admin area"
```

---

## Task 4: Animações de Página com Framer Motion

**Files:**
- Create: `components/layout/PageTransition.tsx`
- Modify: `app/(student)/dashboard/page.tsx`

- [ ] **Step 4.1: Criar `components/layout/PageTransition.tsx`**

```typescript
'use client'

import { motion } from 'framer-motion'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 4.2: Aplicar em `app/(student)/dashboard/page.tsx`**

```typescript
import { PageTransition } from '@/components/layout/PageTransition'

export default function DashboardPage() {
  return (
    <PageTransition className="p-8">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">
        Bem-vindo de volta
      </h1>
      <p className="text-[var(--text-secondary)] mt-2">
        Seus cursos estão aqui.
      </p>
    </PageTransition>
  )
}
```

- [ ] **Step 4.3: Verificar animação**

Navegar entre `/dashboard` e `/meus-cursos` — deve haver fade+slide de entrada suave.

- [ ] **Step 4.4: Commit**

```bash
git add components/layout/PageTransition.tsx app/(student)/dashboard/page.tsx
git commit -m "feat: PageTransition component with fade-slide animation"
```

---

## Task 5: Loading Skeletons Base

**Files:**
- Create: `app/(student)/dashboard/loading.tsx`
- Create: `app/(student)/meus-cursos/loading.tsx`

- [ ] **Step 5.1: Criar `app/(student)/dashboard/loading.tsx`**

```typescript
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="p-8 space-y-8">
      {/* Hero skeleton */}
      <div className="space-y-3">
        <Skeleton
          className="h-8 w-64"
          style={{ background: 'var(--bg-card)' }}
        />
        <Skeleton
          className="h-5 w-48"
          style={{ background: 'var(--bg-card)' }}
        />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-52 rounded-xl"
            style={{ background: 'var(--bg-card)' }}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5.2: Criar `app/(student)/meus-cursos/loading.tsx`**

```typescript
import { Skeleton } from '@/components/ui/skeleton'

export default function MeuscursosLoading() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton
        className="h-8 w-48"
        style={{ background: 'var(--bg-card)' }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-52 rounded-xl"
            style={{ background: 'var(--bg-card)' }}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5.3: Commit**

```bash
git add app/(student)/dashboard/loading.tsx app/(student)/meus-cursos/loading.tsx
git commit -m "feat: loading skeleton states for dashboard and my-courses"
```

---

## Task 6: Verificação Final Visual

- [ ] **Step 6.1: Verificar checklist visual**

```bash
npm run dev
```

Verificar manualmente:
- [ ] Fundo principal `#050914` em todas as páginas
- [ ] Sidebar desktop: `#060A13`, 256px, borda direita sutil
- [ ] Item ativo na sidebar: `bg-card` + borda esquerda azul (student) / amarela (admin)
- [ ] Avatar no rodapé da student sidebar
- [ ] Mobile: hamburger abre drawer com a sidebar
- [ ] Animação de entrada de página (fade + slide up suave)
- [ ] Skeletons com background `#0D1728` (não branco)
- [ ] Admin sidebar: logo amarelo, badge "Admin", borda ativa amarela

- [ ] **Step 6.2: Build check**

```bash
npm run build
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Step 6.3: Commit final da fase**

```bash
git add -A
git commit -m "feat: phase 2 complete — premium dark shell with student and admin layouts"
```

---

## Próxima Fase

Após completar e verificar esta fase:
→ **[Fase 3 — Autenticação](2026-05-30-phase3-auth.md)**
