# Tech Stack

## Frontend

| Tecnologia | Versão | Uso |
|---|---|---|
| **Next.js** | 14+ | Framework principal com App Router |
| **TypeScript** | 5+ | Linguagem (strict mode) |
| **TailwindCSS** | 3+ | Estilização utilitária |
| **Shadcn/UI** | latest | Componentes base (customizados ao design system) |
| **Framer Motion** | 11+ | Animações e transições |

## Backend / Infra

| Tecnologia | Uso |
|---|---|
| **Supabase Auth** | Autenticação JWT (cookie httpOnly) |
| **Supabase PostgreSQL** | Banco de dados principal |
| **Supabase Storage** | Thumbnails de cursos e materiais PDF |
| **Supabase RLS** | Row Level Security (segunda camada de acesso) |
| **Next.js Server Actions** | Mutações de dados (progresso, conta, admin) |
| **Next.js API Route Handler** | Exclusivo para `POST /api/webhooks/hubla` |

## Serviços Externos

| Serviço | Uso |
|---|---|
| **Panda Video** | Hospedagem e streaming de vídeos das aulas |
| **Resend** | E-mails transacionais |
| **Hubla** | Checkout, pagamento, webhooks de acesso |
| **Vercel** | Deploy, CDN, Edge Functions (middleware) |

## Padrões arquiteturais

### App Router — grupos de rotas
```
(public)  → páginas sem autenticação
(student) → área do aluno com StudentShell
(admin)   → área admin com AdminShell
```

### Acesso a dados
- **Leituras:** Server Components chamam `createServerClient` do Supabase diretamente (sem hop de rede extra)
- **Escritas:** Server Actions com validação server-side
- **Webhook:** API Route Handler isolado

### Autenticação
- JWT armazenado em cookie httpOnly (padrão Supabase SSR)
- `middleware.ts` valida sessão sem query ao banco
- Refresh automático via `@supabase/ssr`

## Variáveis de ambiente necessárias

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # apenas server-side

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Hubla Webhook
HUBLA_WEBHOOK_SECRET=            # segredo HMAC para validação

# App
NEXT_PUBLIC_APP_URL=
```

## Decisões de stack

### Por que Next.js App Router?
Server Components permitem verificar matrículas server-side sem expor dados ao cliente. Middleware no Edge valida JWT sem cold start de função serverless. Server Actions eliminam API routes boilerplate.

### Por que Supabase?
Auth + PostgreSQL + Storage em uma plataforma. RLS como camada extra de segurança. `createServerClient` idiomático com Next.js App Router.

### Por que Panda Video?
Plataforma brasileira de video hosting para criadores digitais. Sem marca d'água, CDN próprio, player customizável, preço competitivo, suporte a proteção de conteúdo.

### Por que Resend?
API simples, alta deliverability, suporte a React Email para templates premium.

### Por que Shadcn/UI?
Componentes não são dependências — são copiados para o projeto e completamente customizáveis. Essencial para um design system proprietário premium.
