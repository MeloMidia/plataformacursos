# Fase 1 — Setup do Projeto — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar e configurar o projeto Next.js 14 com App Router, TypeScript strict, TailwindCSS, Supabase SSR, Shadcn/UI e deploy funcional no Vercel — base sobre a qual todas as fases seguintes são construídas.

**Architecture:** Abordagem híbrida C — middleware valida JWT sem DB query; Server Components lêem Supabase via `createServerClient`; Server Actions para mutações; único API Route para webhook. Grupos de rotas `(public)`, `(student)`, `(admin)` com layouts separados.

**Tech Stack:** Next.js 14+ App Router, TypeScript 5 strict, TailwindCSS 3, Shadcn/UI, Supabase SSR (`@supabase/ssr`), Framer Motion, Lucide React, Resend, Vercel.

---

## File Map (arquivos criados nesta fase)

```
/
├── .env.local                          # variáveis de ambiente locais
├── .env.example                        # template de variáveis (sem valores)
├── next.config.ts                      # configuração Next.js
├── tailwind.config.ts                  # tokens do design system
├── components.json                     # config Shadcn/UI
├── middleware.ts                       # proteção de rotas (Edge)
├── app/
│   ├── globals.css                     # CSS custom properties + base styles
│   ├── layout.tsx                      # root layout
│   ├── (public)/
│   │   └── login/
│   │       └── page.tsx                # placeholder
│   ├── (student)/
│   │   ├── layout.tsx                  # placeholder StudentShell
│   │   └── dashboard/
│   │       └── page.tsx                # placeholder
│   └── (admin)/
│       ├── layout.tsx                  # placeholder AdminShell
│       └── admin/
│           └── page.tsx                # placeholder
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # createBrowserClient
│   │   ├── server.ts                   # createServerClient (Server Components)
│   │   └── middleware.ts               # createMiddlewareClient
│   └── utils.ts                        # cn() helper
└── types/
    └── database.ts                     # tipos do schema Supabase (manual por ora)
```

---

## Task 1: Criar o projeto Next.js

**Files:**
- Create: projeto raiz via CLI

- [ ] **Step 1.1: Criar o projeto**

```bash
cd C:\Users\hiigo\Desktop
npx create-next-app@latest plataformaCurso --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
cd plataformaCurso
```

Responder ao prompt:
- TypeScript: Yes
- ESLint: Yes
- Tailwind: Yes
- src/ directory: No
- App Router: Yes
- Import alias: `@/*`

- [ ] **Step 1.2: Instalar dependências principais**

```bash
npm install @supabase/ssr @supabase/supabase-js
npm install framer-motion
npm install lucide-react
npm install resend
npm install @types/node --save-dev
```

- [ ] **Step 1.3: Instalar e inicializar Shadcn/UI**

```bash
npx shadcn@latest init
```

Responder:
- Which style? → **Default**
- Which base color? → **Slate**
- CSS variables? → **Yes**

- [ ] **Step 1.4: Verificar que o projeto roda**

```bash
npm run dev
```

Abrir `http://localhost:3000`. Deve mostrar a página padrão Next.js.

- [ ] **Step 1.5: Commit inicial**

```bash
git add -A
git commit -m "chore: initialize Next.js project with TypeScript, Tailwind, Shadcn"
```

---

## Task 2: Configurar Design System — Tailwind e CSS Variables

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 2.1: Substituir `tailwind.config.ts` completo**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base':       'var(--bg-base)',
        'bg-secondary':  'var(--bg-secondary)',
        'bg-sidebar':    'var(--bg-sidebar)',
        'bg-card':       'var(--bg-card)',
        'bg-card-hover': 'var(--bg-card-hover)',
        border:          'var(--border)',
        'border-focus':  'var(--border-focus)',
        'blue-primary':  'var(--blue-primary)',
        'blue-premium':  'var(--blue-premium)',
        'blue-accent':   'var(--blue-accent)',
        yellow:          'var(--yellow)',
        'yellow-hover':  'var(--yellow-hover)',
        'text-primary':  'var(--text-primary)',
        'text-secondary':'var(--text-secondary)',
        'text-muted':    'var(--text-muted)',
        'text-disabled': 'var(--text-disabled)',
      },
      borderRadius: {
        sm:  'var(--radius-sm)',
        md:  'var(--radius-md)',
        lg:  'var(--radius-lg)',
        xl:  'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs:   ['0.75rem',  { lineHeight: '1rem' }],
        sm:   ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem',     { lineHeight: '1.5rem' }],
        lg:   ['1.125rem', { lineHeight: '1.75rem' }],
        xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl':['1.5rem',   { lineHeight: '2rem' }],
        '3xl':['1.875rem', { lineHeight: '2.25rem' }],
        '4xl':['2.25rem',  { lineHeight: '2.5rem' }],
        '5xl':['3rem',     { lineHeight: '1' }],
      },
      boxShadow: {
        'card':       '0 0 40px rgba(0, 87, 255, 0.08)',
        'card-hover': '0 0 60px rgba(0, 87, 255, 0.18)',
        'blue-sm':    '0 0 20px rgba(0, 87, 255, 0.12)',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.0, 0, 0.2, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

- [ ] **Step 2.2: Instalar `tailwindcss-animate`**

```bash
npm install tailwindcss-animate
```

- [ ] **Step 2.3: Substituir `app/globals.css` completo**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Backgrounds */
  --bg-base:        #050914;
  --bg-secondary:   #08111F;
  --bg-sidebar:     #060A13;
  --bg-card:        #0D1728;
  --bg-card-hover:  #111E33;

  /* Bordas */
  --border:         #1E2A3D;
  --border-focus:   #0057FF;

  /* Azul */
  --blue-primary:   #0057FF;
  --blue-premium:   #003B99;
  --blue-accent:    #2F80FF;

  /* Amarelo */
  --yellow:         #FFD400;
  --yellow-hover:   #FFE45C;
  --yellow-dim:     rgba(255, 212, 0, 0.15);

  /* Texto */
  --text-primary:   #FFFFFF;
  --text-secondary: #A7B0C0;
  --text-muted:     #64748B;
  --text-disabled:  #3D4A5C;

  /* Status */
  --success:        #22C55E;
  --warning:        #F59E0B;
  --error:          #EF4444;

  /* Radius */
  --radius-sm:  6px;
  --radius-md:  8px;
  --radius-lg:  12px;
  --radius-xl:  16px;
  --radius-2xl: 24px;
}

* {
  border-color: var(--border);
}

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scrollbar premium */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-base);
}
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Shadcn/UI overrides para tema dark */
.dark {
  --background: var(--bg-base);
  --foreground: var(--text-primary);
  --card: var(--bg-card);
  --card-foreground: var(--text-primary);
  --popover: var(--bg-secondary);
  --popover-foreground: var(--text-primary);
  --primary: var(--blue-primary);
  --primary-foreground: #ffffff;
  --secondary: var(--bg-card);
  --secondary-foreground: var(--text-secondary);
  --muted: var(--bg-secondary);
  --muted-foreground: var(--text-muted);
  --accent: var(--blue-accent);
  --accent-foreground: #ffffff;
  --destructive: var(--error);
  --destructive-foreground: #ffffff;
  --border: var(--border);
  --input: var(--bg-card);
  --ring: var(--blue-primary);
  --radius: 0.5rem;
}
```

- [ ] **Step 2.4: Atualizar `app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Plataforma de Cursos',
  description: 'Sua área de membros premium',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2.5: Verificar fundo escuro**

```bash
npm run dev
```

Abrir `http://localhost:3000`. O fundo deve ser `#050914` (quase preto azulado).

- [ ] **Step 2.6: Commit**

```bash
git add -A
git commit -m "chore: configure design system tokens — dark premium palette"
```

---

## Task 3: Configurar Supabase SSR

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/middleware.ts`
- Create: `.env.local`
- Create: `.env.example`

- [ ] **Step 3.1: Criar `.env.local`**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SEU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=SEU_SERVICE_ROLE_KEY

# Resend
RESEND_API_KEY=re_SEU_KEY
RESEND_FROM_EMAIL=noreply@seudominio.com

# Hubla
HUBLA_WEBHOOK_SECRET=SEU_SEGREDO_HMAC

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Preencher com os valores reais do Supabase (Project Settings → API).

- [ ] **Step 3.2: Criar `.env.example`**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Hubla
HUBLA_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=
```

- [ ] **Step 3.3: Criar `lib/supabase/client.ts`**

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 3.4: Criar `lib/supabase/server.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Ignorado em Server Components — só funciona em Server Actions/Route Handlers
          }
        },
      },
    }
  )
}
```

- [ ] **Step 3.5: Criar `lib/supabase/middleware.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { supabaseResponse, user }
}
```

- [ ] **Step 3.6: Criar `types/database.ts`** (tipos manuais iniciais — será gerado pelo Supabase CLI na Fase 4)

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'student' | 'admin' | 'support'
export type CourseStatus = 'draft' | 'published'
export type EnrollmentStatus = 'active' | 'revoked' | 'expired'
export type GrantedBy = 'webhook' | 'manual'
export type PurchaseStatus = 'approved' | 'refunded' | 'cancelled'
export type ProductType = 'single' | 'combo'
export type MaterialType = 'pdf' | 'link' | 'zip'

export interface Profile {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string | null
  thumbnail_url: string | null
  trailer_panda_id: string | null
  status: CourseStatus
  created_at: string
  updated_at: string
}

export interface Module {
  id: string
  course_id: string
  title: string
  description: string | null
  order_index: number
  created_at: string
}

export interface Lesson {
  id: string
  module_id: string
  title: string
  panda_video_id: string
  duration_seconds: number
  order_index: number
  is_preview: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  hubla_product_id: string
  name: string
  type: ProductType
  active: boolean
  created_at: string
}

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  status: EnrollmentStatus
  granted_by: GrantedBy
  granted_at: string
  revoked_at: string | null
  updated_at: string
}

export interface Purchase {
  id: string
  student_id: string
  product_id: string | null
  hubla_order_id: string
  amount_cents: number
  status: PurchaseStatus
  purchased_at: string
  updated_at: string
}

export interface WebhookEvent {
  id: string
  hubla_event_id: string
  event_type: string
  payload: Json
  processed: boolean
  error: string | null
  received_at: string
}

export interface LessonProgress {
  id: string
  student_id: string
  lesson_id: string
  completed: boolean
  watched_seconds: number
  last_watched_at: string
}

export interface Material {
  id: string
  course_id: string
  module_id: string | null
  lesson_id: string | null
  title: string
  file_url: string
  type: MaterialType
  created_at: string
}

// Placeholder para geração automática futura via Supabase CLI
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, 'created_at' | 'updated_at'>; Update: Partial<Profile> }
      courses: { Row: Course; Insert: Omit<Course, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Course> }
      modules: { Row: Module; Insert: Omit<Module, 'id' | 'created_at'>; Update: Partial<Module> }
      lessons: { Row: Lesson; Insert: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Lesson> }
      products: { Row: Product; Insert: Omit<Product, 'id' | 'created_at'>; Update: Partial<Product> }
      enrollments: { Row: Enrollment; Insert: Omit<Enrollment, 'id' | 'granted_at' | 'updated_at'>; Update: Partial<Enrollment> }
      purchases: { Row: Purchase; Insert: Omit<Purchase, 'id' | 'purchased_at' | 'updated_at'>; Update: Partial<Purchase> }
      webhook_events: { Row: WebhookEvent; Insert: Omit<WebhookEvent, 'id' | 'received_at'>; Update: Partial<WebhookEvent> }
      lesson_progress: { Row: LessonProgress; Insert: Omit<LessonProgress, 'id'>; Update: Partial<LessonProgress> }
      materials: { Row: Material; Insert: Omit<Material, 'id' | 'created_at'>; Update: Partial<Material> }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
```

- [ ] **Step 3.7: Criar `lib/utils.ts`**

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 3.8: Instalar `clsx` e `tailwind-merge` (se não instalados pelo Shadcn)**

```bash
npm install clsx tailwind-merge
```

- [ ] **Step 3.9: Commit**

```bash
git add -A
git commit -m "chore: configure Supabase SSR clients and TypeScript database types"
```

---

## Task 4: Criar Middleware de Proteção de Rotas

**Files:**
- Create: `middleware.ts`

- [ ] **Step 4.1: Criar `middleware.ts` na raiz do projeto**

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PUBLIC_ROUTES = ['/login', '/forgot-password', '/reset-password']
const ADMIN_PREFIX = '/admin'

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname.startsWith(route)
  )

  // Sem sessão em rota protegida → login
  if (!user && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Com sessão em rota pública → dashboard
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

- [ ] **Step 4.2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add route protection middleware with Supabase session check"
```

---

## Task 5: Criar Estrutura de Rotas com Placeholders

**Files:**
- Create: `app/(public)/login/page.tsx`
- Create: `app/(student)/layout.tsx`
- Create: `app/(student)/dashboard/page.tsx`
- Create: `app/(admin)/layout.tsx`
- Create: `app/(admin)/admin/page.tsx`

- [ ] **Step 5.1: Criar `app/(public)/login/page.tsx`**

```typescript
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
      <p className="text-[var(--text-secondary)]">Login — em breve</p>
    </div>
  )
}
```

- [ ] **Step 5.2: Criar `app/(public)/forgot-password/page.tsx`**

```typescript
export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
      <p className="text-[var(--text-secondary)]">Recuperar senha — em breve</p>
    </div>
  )
}
```

- [ ] **Step 5.3: Criar `app/(public)/reset-password/page.tsx`**

```typescript
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
      <p className="text-[var(--text-secondary)]">Redefinir senha — em breve</p>
    </div>
  )
}
```

- [ ] **Step 5.4: Criar `app/(student)/layout.tsx`**

```typescript
export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* StudentShell será implementado na Fase 2 */}
      {children}
    </div>
  )
}
```

- [ ] **Step 5.5: Criar `app/(student)/dashboard/page.tsx`**

```typescript
export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">
        Dashboard — em breve
      </h1>
    </div>
  )
}
```

- [ ] **Step 5.6: Criar rotas placeholder do aluno**

Criar `app/(student)/continuar-assistindo/page.tsx`:
```typescript
export default function ContinueWatchingPage() {
  return <div className="p-8"><h1 className="text-2xl font-bold">Continuar Assistindo</h1></div>
}
```

Criar `app/(student)/meus-cursos/page.tsx`:
```typescript
export default function MeuscursosPage() {
  return <div className="p-8"><h1 className="text-2xl font-bold">Meus Cursos</h1></div>
}
```

Criar `app/(student)/materiais/page.tsx`:
```typescript
export default function MateriaisPage() {
  return <div className="p-8"><h1 className="text-2xl font-bold">Materiais</h1></div>
}
```

Criar `app/(student)/suporte/page.tsx`:
```typescript
export default function SuportePage() {
  return <div className="p-8"><h1 className="text-2xl font-bold">Suporte</h1></div>
}
```

Criar `app/(student)/minha-conta/page.tsx`:
```typescript
export default function MinhaContaPage() {
  return <div className="p-8"><h1 className="text-2xl font-bold">Minha Conta</h1></div>
}
```

Criar `app/(student)/curso/[slug]/page.tsx`:
```typescript
export default function CoursePage({ params }: { params: { slug: string } }) {
  return <div className="p-8"><h1 className="text-2xl font-bold">Curso: {params.slug}</h1></div>
}
```

Criar `app/(student)/curso/[slug]/aula/[lessonId]/page.tsx`:
```typescript
export default function LessonPage({ params }: { params: { slug: string; lessonId: string } }) {
  return <div className="p-8"><h1 className="text-2xl font-bold">Aula: {params.lessonId}</h1></div>
}
```

- [ ] **Step 5.7: Criar `app/(admin)/layout.tsx`**

```typescript
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* AdminShell será implementado na Fase 2 */}
      {children}
    </div>
  )
}
```

- [ ] **Step 5.8: Criar rotas placeholder do admin**

Criar `app/(admin)/admin/page.tsx`:
```typescript
export default function AdminPage() {
  return <div className="p-8"><h1 className="text-2xl font-bold text-white">Admin Dashboard</h1></div>
}
```

Criar `app/(admin)/admin/cursos/page.tsx`:
```typescript
export default function AdminCursosPage() {
  return <div className="p-8"><h1 className="text-2xl font-bold text-white">Admin — Cursos</h1></div>
}
```

Criar `app/(admin)/admin/alunos/page.tsx`:
```typescript
export default function AdminAlunosPage() {
  return <div className="p-8"><h1 className="text-2xl font-bold text-white">Admin — Alunos</h1></div>
}
```

Criar `app/(admin)/admin/vendas/page.tsx`:
```typescript
export default function AdminVendasPage() {
  return <div className="p-8"><h1 className="text-2xl font-bold text-white">Admin — Vendas</h1></div>
}
```

Criar `app/(admin)/admin/webhooks/page.tsx`:
```typescript
export default function AdminWebhooksPage() {
  return <div className="p-8"><h1 className="text-2xl font-bold text-white">Admin — Webhooks</h1></div>
}
```

Criar `app/(admin)/admin/produtos/page.tsx`:
```typescript
export default function AdminProdutosPage() {
  return <div className="p-8"><h1 className="text-2xl font-bold text-white">Admin — Produtos</h1></div>
}
```

- [ ] **Step 5.9: Verificar rotas navegando manualmente**

```bash
npm run dev
```

Visitar:
- `http://localhost:3000/login` → deve mostrar "Login — em breve" (fundo escuro)
- `http://localhost:3000/dashboard` → deve redirecionar para `/login` (sem sessão)
- `http://localhost:3000/admin` → deve redirecionar para `/login`

- [ ] **Step 5.10: Commit**

```bash
git add -A
git commit -m "feat: scaffold all route groups and placeholder pages"
```

---

## Task 6: Instalar Componentes Shadcn/UI Base

**Files:**
- Cria automaticamente em `components/ui/`

- [ ] **Step 6.1: Instalar componentes necessários**

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add accordion
npx shadcn@latest add separator
npx shadcn@latest add skeleton
npx shadcn@latest add toast
npx shadcn@latest add dropdown-menu
npx shadcn@latest add scroll-area
npx shadcn@latest add table
npx shadcn@latest add form
```

- [ ] **Step 6.2: Verificar TypeScript sem erros**

```bash
npx tsc --noEmit
```

Esperado: sem erros. Se houver erros de tipos, corrigir antes de continuar.

- [ ] **Step 6.3: Commit**

```bash
git add -A
git commit -m "chore: install Shadcn/UI base components"
```

---

## Task 7: Configurar `next.config.ts`

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 7.1: Atualizar `next.config.ts`**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'player.pandavideo.com.br',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

export default nextConfig
```

- [ ] **Step 7.2: Verificar build**

```bash
npm run build
```

Esperado: build sem erros (pode ter warnings de `any` nos tipos — ignorar por ora).

- [ ] **Step 7.3: Commit**

```bash
git add next.config.ts
git commit -m "chore: configure Next.js image domains and server actions"
```

---

## Task 8: Deploy no Vercel

- [ ] **Step 8.1: Criar repositório Git (se ainda não existir)**

```bash
git init  # se necessário — create-next-app já inicializa
git remote add origin https://github.com/SEU_USUARIO/plataforma-cursos.git
git push -u origin main
```

- [ ] **Step 8.2: Importar projeto no Vercel**

1. Acessar `https://vercel.com/new`
2. Importar o repositório GitHub
3. Framework: Next.js (detectado automaticamente)
4. Adicionar variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `HUBLA_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_APP_URL` (a URL do Vercel)
5. Clicar em "Deploy"

- [ ] **Step 8.3: Verificar deploy**

Acessar a URL do Vercel. Visitar `/login` — deve mostrar fundo dark com texto placeholder.
Visitar `/dashboard` — deve redirecionar para `/login`.

- [ ] **Step 8.4: Commit final da fase**

```bash
git add -A
git commit -m "chore: phase 1 complete — project setup, design tokens, route structure, Vercel deploy"
```

---

## Verificação Final da Fase 1

- [ ] `npm run dev` inicia sem erros
- [ ] `npm run build` completa sem erros
- [ ] `npx tsc --noEmit` sem erros
- [ ] `/login` exibe fundo `#050914`
- [ ] `/dashboard` sem sessão → redireciona para `/login`
- [ ] `/admin` sem sessão → redireciona para `/login`
- [ ] Deploy Vercel funcionando
- [ ] Variáveis de ambiente configuradas no Vercel

---

## Próxima Fase

Após completar e verificar esta fase:
→ **[Fase 2 — Design System e Layout Base](2026-05-30-phase2-design-system.md)**
