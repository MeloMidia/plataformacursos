---
name: plataforma-cursos-design
description: Spec arquitetural completo da plataforma de cursos online — Next.js, Supabase, Panda Video, Hubla webhook, design premium dark
metadata:
  type: project
---

# Plataforma de Cursos Online — Design Spec

**Data:** 2026-05-30  
**Status:** Aprovado pelo usuário

---

## Contexto

Plataforma própria de área de membros para venda e consumo de cursos online. Pagamento e checkout via **Hubla**. Após aprovação de compra, a Hubla envia webhook que libera automaticamente o acesso do aluno ao(s) curso(s) comprado(s). Suporte a múltiplos cursos com controle de acesso individual por matrícula.

---

## Stack Definida

- **Framework:** Next.js 14+ com App Router
- **Linguagem:** TypeScript (strict)
- **Auth + DB + Storage:** Supabase
- **Banco:** PostgreSQL via Supabase
- **Estilo:** TailwindCSS + Shadcn/UI (customizado — não defaults genéricos)
- **Animações:** Framer Motion
- **Vídeo:** Panda Video (iframe embed por `panda_video_id`)
- **E-mail:** Resend
- **Pagamento/Checkout:** Hubla (externo — apenas integração via webhook)
- **Deploy:** Vercel

---

## Abordagem Arquitetural: Híbrida C

- **Middleware** → valida sessão JWT (autenticado ou não), sem query ao banco
- **Server Components / Layouts** → verificam matrícula diretamente via `createServerClient`
- **Server Actions** → todas as mutações de dados (progresso, conta, admin)
- **API Route Handler exclusivo** → `POST /api/webhooks/hubla` (validação HMAC + idempotência)
- **RLS Supabase** → segunda camada de segurança (defense in depth)

---

## Arquitetura do Sistema

```
Vercel (Edge)
  middleware.ts → valida JWT → redireciona se necessário
  
  App Router
    (public)/login, /forgot-password, /reset-password
    (student)/dashboard, /meus-cursos, /curso/[slug]/aula/[lessonId], etc.
      └─ /(student)/curso/[slug]/layout.tsx → verifica enrollment
    (admin)/admin/**
      └─ /(admin)/layout.tsx → verifica role=admin
  
  API Routes
    POST /api/webhooks/hubla → HMAC validation → upsert enrollment

Supabase
  Auth (JWT httpOnly cookie)
  PostgreSQL (profiles, courses, enrollments, webhook_events, ...)
  Storage (thumbnails, materiais PDF)
  RLS (defense in depth)

Externos
  Panda Video → embed iframe
  Resend → e-mails transacionais
  Hubla → webhook de compra/cancelamento
```

---

## Schema do Banco de Dados

### `profiles`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | FK → auth.users |
| full_name | text | |
| email | text | único |
| avatar_url | text | nullable |
| role | enum | 'student' \| 'admin' \| 'support' |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `courses`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| slug | text | único, URL-friendly |
| title | text | |
| description | text | |
| thumbnail_url | text | |
| trailer_panda_id | text | nullable |
| status | enum | 'draft' \| 'published' |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `modules`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| course_id | uuid | FK → courses |
| title | text | |
| description | text | nullable |
| order_index | int | |
| created_at | timestamptz | |

### `lessons`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| module_id | uuid | FK → modules |
| title | text | |
| panda_video_id | text | |
| duration_seconds | int | |
| order_index | int | |
| is_preview | bool | default false |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `products`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| hubla_product_id | text | único |
| name | text | |
| type | enum | 'single' \| 'combo' |
| active | bool | default true |
| created_at | timestamptz | |

### `product_courses`
| Campo | Tipo | Notas |
|---|---|---|
| product_id | uuid | FK → products |
| course_id | uuid | FK → courses |
| PK composta | | (product_id, course_id) |

### `enrollments`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| student_id | uuid | FK → profiles |
| course_id | uuid | FK → courses |
| status | enum | 'active' \| 'revoked' \| 'expired' |
| granted_by | enum | 'webhook' \| 'manual' |
| granted_at | timestamptz | |
| revoked_at | timestamptz | nullable |
| updated_at | timestamptz | |
| UNIQUE | | (student_id, course_id) |

### `purchases`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| student_id | uuid | FK → profiles |
| product_id | uuid | FK → products |
| hubla_order_id | text | único |
| amount_cents | int | |
| status | enum | 'approved' \| 'refunded' \| 'cancelled' |
| purchased_at | timestamptz | |
| updated_at | timestamptz | |

### `webhook_events`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| hubla_event_id | text | único — chave de idempotência |
| event_type | varchar | ex: 'purchase.approved' |
| payload | jsonb | raw payload preservado |
| processed | bool | default false |
| error | text | nullable |
| received_at | timestamptz | |

### `lesson_progress`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| student_id | uuid | FK → profiles |
| lesson_id | uuid | FK → lessons |
| completed | bool | default false |
| watched_seconds | int | |
| last_watched_at | timestamptz | |
| UNIQUE | | (student_id, lesson_id) |

### `materials`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| course_id | uuid | FK → courses |
| module_id | uuid | nullable FK → modules |
| lesson_id | uuid | nullable FK → lessons |
| title | text | |
| file_url | text | |
| type | enum | 'pdf' \| 'link' \| 'zip' |
| created_at | timestamptz | |

---

## Auth e Controle de Acesso

### Camadas (mais externa → mais interna)

1. **`middleware.ts`** — valida JWT, sem DB query
2. **`/(student)/curso/[slug]/layout.tsx`** — query enrollment server-side
3. **`/(admin)/layout.tsx`** — verifica `role = 'admin'`
4. **RLS PostgreSQL** — defense in depth

### Fluxo de Compra (webhook)
```
POST /api/webhooks/hubla
  1. Valida X-Hubla-Signature (HMAC-SHA256)
  2. Insere webhook_events (idempotência por hubla_event_id)
  3. Se já processado → retorna 200 sem ação
  4. Localiza ou cria profiles por email
  5. Se novo usuário: createUser() + Resend "Seu acesso está pronto" com link de senha
  6. Mapeia hubla_product_id → product_courses → course_ids
  7. UPSERT enrollments (status=active, granted_by=webhook)
  8. Marca webhook_event.processed = true
```

### Fluxo de Cancelamento/Reembolso
```
  1–3. Mesmo fluxo de validação e idempotência
  4. UPDATE enrollments SET status='revoked', revoked_at=now()
```

---

## UI Architecture

### Grupos de Rotas
```
app/
├── (public)/login, /forgot-password, /reset-password
├── (student)/dashboard, /continuar-assistindo, /meus-cursos,
│            /curso/[slug], /curso/[slug]/aula/[lessonId],
│            /materiais, /suporte, /minha-conta
└── (admin)/admin, /admin/cursos, /admin/alunos,
           /admin/vendas, /admin/webhooks, /admin/produtos
```

### Componentes Principais
StudentShell, StudentSidebar, StudentHeader, CourseHero, CourseCard, LockedCourseCard, ContinueWatchingCard, ModuleAccordion, LessonItem, LessonPlayer (Panda Video iframe), ProgressBar, StatusBadge, UpgradeCTA, AccessDenied, AdminShell, AdminSidebar

---

## Design System

### Paleta
```
--bg-base:       #050914
--bg-secondary:  #08111F
--bg-sidebar:    #060A13
--bg-card:       #0D1728
--border:        #1E2A3D
--blue-primary:  #0057FF
--blue-premium:  #003B99
--blue-accent:   #2F80FF
--yellow:        #FFD400
--yellow-hover:  #FFE45C
--text-primary:  #FFFFFF
--text-secondary:#A7B0C0
--text-muted:    #64748B
```

### Regras Visuais
- Fundo nunca branco ou cinza claro
- Sidebar fixa 256px desktop, colapsável mobile
- Amarelo exclusivo para: CTA principal, progresso, badge premium
- Cards com `box-shadow: 0 0 40px rgba(0,87,255,0.08)`
- Hover: `translateY(-2px)` + glow blue intensificado
- Tipografia: Inter — display para heroes
- Radius: 12px cards, 8px botões, 6px badges

---

## Decisões Finais

| Decisão | Escolha |
|---|---|
| Auth | Supabase Auth + JWT httpOnly cookie |
| Vídeo | Panda Video (panda_video_id) |
| E-mail | Resend |
| Acesso | Middleware (auth) + Layout RSC (enrollment) |
| Webhook | HMAC-SHA256 + idempotência por hubla_event_id |
| Mutações | Server Actions (exceto webhook = API Route) |
| Admin manual | Full CRUD em enrollments |
| Deploy | Vercel + Supabase |
| Frontend | Premium SaaS — consultar frontend-design + ui-ux-pro-max skills |
