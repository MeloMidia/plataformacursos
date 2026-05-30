# Development Plan — Plataforma de Cursos Online

Plano de desenvolvimento dividido em 9 fases sequenciais. Cada fase entrega valor independente e pode ser testada antes de avançar.

---

## Fase 1 — Setup do Projeto

**Objetivo:** Projeto Next.js pronto, configurado e deployado em Vercel (versão em branco).

### Tarefas
- [ ] `npx create-next-app@latest` com TypeScript, TailwindCSS, App Router, src/ off
- [ ] Instalar dependências: `@supabase/ssr`, `@supabase/supabase-js`, `shadcn-ui`, `framer-motion`, `resend`, `lucide-react`
- [ ] Configurar `tailwind.config.ts` com design tokens da paleta (CSS custom properties)
- [ ] Configurar `globals.css` com todas as variáveis CSS do design system
- [ ] Configurar `components.json` do Shadcn/UI (tema dark, radius 12px)
- [ ] Criar `.env.local` com todas as variáveis necessárias
- [ ] Criar `lib/supabase/client.ts` — `createBrowserClient`
- [ ] Criar `lib/supabase/server.ts` — `createServerClient` (cookies)
- [ ] Criar `lib/supabase/middleware.ts` — `createMiddlewareClient`
- [ ] Criar `middleware.ts` com proteção de rotas
- [ ] Criar estrutura de pastas: `app/(public)`, `app/(student)`, `app/(admin)`
- [ ] Deploy inicial no Vercel (branch main)
- [ ] Configurar variáveis de ambiente no Vercel

**Entrega:** URL Vercel funcionando com página em branco nas rotas públicas.

---

## Fase 2 — Design System e Layout Base

**Objetivo:** Shell visual completo da plataforma com sidebar, header e sistema de design implementado. Sem dados reais.

### Tarefas
- [ ] Instalar e customizar componentes Shadcn/UI: Button, Card, Badge, Avatar, Input, Dialog, Sheet, Accordion, Separator, Skeleton
- [ ] Aplicar paleta de cores ao tema Shadcn (`globals.css` + `tailwind.config.ts`)
- [ ] Criar `components/ui/` com variantes customizadas (nunca usar defaults genéricos)
- [ ] Criar `components/layout/StudentSidebar.tsx` — sidebar fixa, logo, nav, avatar
- [ ] Criar `components/layout/StudentShell.tsx` — wrapper com sidebar + main
- [ ] Criar `components/layout/StudentHeader.tsx` — header mobile + breadcrumb
- [ ] Criar `components/layout/AdminSidebar.tsx`
- [ ] Criar `components/layout/AdminShell.tsx`
- [ ] Implementar `app/(student)/layout.tsx` usando StudentShell
- [ ] Implementar `app/(admin)/layout.tsx` usando AdminShell
- [ ] Criar páginas placeholder para todas as rotas (student + admin)
- [ ] Implementar animações de entrada de página com Framer Motion
- [ ] Responsividade: sidebar drawer no mobile

**Entrega:** Shell visual premium navegável com todas as rotas (sem dados).

---

## Fase 3 — Autenticação

**Objetivo:** Login, registro via webhook, reset de senha funcionando com Supabase Auth.

### Tarefas
- [ ] Criar `app/(public)/login/page.tsx` com design premium dark
- [ ] Criar `app/(public)/forgot-password/page.tsx`
- [ ] Criar `app/(public)/reset-password/page.tsx`
- [ ] Implementar Server Actions: `signIn`, `signOut`, `resetPassword`, `updatePassword`
- [ ] Integrar Resend: template de e-mail "Boas-vindas + Defina sua senha"
- [ ] Integrar Resend: template de e-mail "Reset de senha"
- [ ] Criar templates React Email (design consistente com a plataforma)
- [ ] Testar fluxo completo: criar conta → e-mail → definir senha → login
- [ ] Implementar `app/(student)/minha-conta/page.tsx` — editar nome, avatar, senha
- [ ] Proteger rotas públicas: redirect para /dashboard se já logado

**Entrega:** Auth completo. Usuário pode fazer login, recuperar senha, editar conta.

---

## Fase 4 — Banco de Dados

**Objetivo:** Schema completo criado no Supabase com dados de teste.

### Tarefas
- [ ] Criar migration: `profiles` + trigger `handle_new_user`
- [ ] Criar migration: `courses`, `modules`, `lessons`
- [ ] Criar migration: `products`, `product_courses`
- [ ] Criar migration: `enrollments`
- [ ] Criar migration: `purchases`
- [ ] Criar migration: `webhook_events`
- [ ] Criar migration: `lesson_progress`
- [ ] Criar migration: `materials`
- [ ] Criar todos os índices de performance
- [ ] Configurar RLS policies (profiles, enrollments, lesson_progress)
- [ ] Criar seed com dados de teste: 2 cursos, 3 módulos cada, 5 aulas por módulo
- [ ] Criar seed: 1 produto single, 1 produto combo
- [ ] Criar seed: 1 admin, 2 alunos com matrículas diferentes
- [ ] Testar queries de enrollment e progress server-side

**Entrega:** Schema completo com dados de teste, RLS validado.

---

## Fase 5 — Área do Aluno

**Objetivo:** Todas as telas do aluno funcionando com dados reais do Supabase.

### Tarefas

**Dashboard (`/dashboard`)**
- [ ] `ContinueWatchingCard` — última aula com progresso
- [ ] `CourseCard` — vitrine de cursos matriculados
- [ ] `LockedCourseCard` — cursos não comprados com cadeado
- [ ] Seção "Continuar assistindo" com scroll horizontal

**Meus Cursos (`/meus-cursos`)**
- [ ] Grid de cursos matriculados com `ProgressBar` por curso
- [ ] Vitrine de cursos disponíveis para compra (locked)

**Página do Curso (`/curso/[slug]`)**
- [ ] `CourseHero` — thumbnail, título, descrição, progresso geral
- [ ] `ModuleAccordion` — accordion de módulos com `LessonItem`s
- [ ] `LessonItem` — ícone de play/check, título, duração
- [ ] Indicador de aula atual / concluída

**Player da Aula (`/curso/[slug]/aula/[lessonId]`)**
- [ ] `LessonPlayer` — iframe Panda Video responsivo
- [ ] Navegação prev/next entre aulas
- [ ] Server Action para upsert `lesson_progress`
- [ ] Marcar aula como concluída
- [ ] Sidebar da aula com lista de aulas do módulo

**Materiais (`/materiais`)**
- [ ] Lista de materiais agrupados por curso

**Suporte (`/suporte`)**
- [ ] Página simples com formulário ou link externo

**Conta (`/minha-conta`)**
- [ ] Editar nome, avatar (Supabase Storage), senha

**Entrega:** Área do aluno 100% funcional com dados reais.

---

## Fase 6 — Controle de Acesso por Curso

**Objetivo:** Garantir que alunos só acessem cursos com matrícula ativa.

### Tarefas
- [ ] Implementar `/(student)/curso/[slug]/layout.tsx` com verificação de enrollment
- [ ] Criar `components/student/AccessDenied.tsx` — tela de bloqueio premium
- [ ] Criar `components/student/UpgradeCTA.tsx` — CTA para comprar na Hubla
- [ ] `LockedCourseCard` com overlay de cadeado e botão de upgrade
- [ ] Testar: aluno sem matrícula não acessa `/curso/[slug]/aula/[lessonId]`
- [ ] Testar: aluno com matrícula revogada perde acesso imediatamente
- [ ] Testar: URL direta de aula bloqueada retorna AccessDenied (não 404)
- [ ] Verificar que RLS impede acesso direto ao banco mesmo sem middleware

**Entrega:** Controle de acesso robusto testado em todos os cenários.

---

## Fase 7 — Integração com Webhook da Hubla

**Objetivo:** Webhook funcionando end-to-end: compra → acesso liberado; reembolso → acesso revogado.

### Tarefas
- [ ] Criar `app/api/webhooks/hubla/route.ts`
- [ ] Implementar validação HMAC-SHA256 (`X-Hubla-Signature`)
- [ ] Implementar lógica de idempotência (check `hubla_event_id`)
- [ ] Implementar handler de GRANT: createUser + Resend + enrollment
- [ ] Implementar handler de REVOKE: update enrollment + purchases
- [ ] Tratar erro sem propagar 5xx (retornar 200 com error salvo)
- [ ] Testar com payload simulado (curl local)
- [ ] Testar idempotência: mesmo payload duas vezes → apenas 1 enrollment
- [ ] Testar reembolso: enrollment revogado, login ainda funciona mas acesso bloqueado
- [ ] Configurar webhook na Hubla (staging primeiro)
- [ ] Testar end-to-end com Hubla sandbox

**Entrega:** Webhook funcionando. Compra na Hubla → acesso liberado em < 5 segundos.

---

## Fase 8 — Área Administrativa

**Objetivo:** Admin pode gerenciar cursos, alunos, acessos, vendas e webhooks.

### Tarefas

**Dashboard Admin (`/admin`)**
- [ ] Métricas: total de alunos, vendas do mês, cursos ativos

**Cursos (`/admin/cursos`)**
- [ ] Listar cursos com status
- [ ] Criar curso: título, slug, descrição, thumbnail, trailer
- [ ] Editar curso + gerenciar módulos e aulas (drag-and-drop order)
- [ ] Publicar / despublicar curso
- [ ] Upload de thumbnail no Supabase Storage

**Alunos (`/admin/alunos`)**
- [ ] Listar alunos com busca por e-mail/nome
- [ ] Perfil do aluno: matrículas, progresso, compras
- [ ] Conceder acesso manual a curso (modal de seleção de curso)
- [ ] Revogar acesso a curso (confirmar ação)

**Vendas (`/admin/vendas`)**
- [ ] Tabela de compras com filtros por status e período

**Webhooks (`/admin/webhooks`)**
- [ ] Tabela de webhook_events com filtro por status e tipo
- [ ] Ver payload bruto de qualquer evento
- [ ] Botão "Reprocessar" para eventos com erro

**Produtos (`/admin/produtos`)**
- [ ] CRUD de produtos Hubla
- [ ] Mapear produto → cursos (checkboxes)

**Entrega:** Admin completo. Operações manuais e visibilidade total do sistema.

---

## Fase 9 — Tracking, E-mails e Finalização

**Objetivo:** Polimento, observabilidade, e-mails finais e preparação para produção.

### Tarefas

**Tracking de progresso**
- [ ] Calcular `course_progress` (%) baseado em lesson_progress
- [ ] Exibir percentual no CourseCard, CourseHero e dashboard
- [ ] Marcar curso como "Concluído" quando 100%

**E-mails transacionais finais**
- [ ] Template "Boas-vindas" (disparado no webhook de compra)
- [ ] Template "Defina sua senha" (com link Supabase)
- [ ] Template "Reset de senha"
- [ ] Template "Acesso revogado" (opcional — informativo)

**Polimento de UI**
- [ ] Skeletons de loading em todos os componentes de dados
- [ ] Estados vazios (sem cursos, sem progresso)
- [ ] Toasts de sucesso/erro em todas as actions
- [ ] Animações de transição entre páginas
- [ ] Teste responsivo em mobile/tablet

**Performance**
- [ ] Adicionar `loading.tsx` em rotas pesadas
- [ ] Lazy load de componentes não-críticos
- [ ] Otimizar queries com índices (confirmar EXPLAIN ANALYZE)

**Segurança final**
- [ ] Auditar Server Actions: validar user session em todas
- [ ] Confirmar RLS policies cobrindo todos os casos
- [ ] Confirmar que nenhuma `SUPABASE_SERVICE_ROLE_KEY` vaza para o cliente
- [ ] Sanitizar inputs do admin (XSS prevention)

**Deploy e monitoramento**
- [ ] Configurar domínio customizado no Vercel
- [ ] Configurar variáveis de ambiente de produção
- [ ] Testar webhook end-to-end em produção
- [ ] Configurar alertas de erro (Vercel Analytics ou Sentry)

**Entrega:** Plataforma pronta para produção.

---

## Resumo das Fases

| Fase | Estimativa | Entrega |
|---|---|---|
| 1. Setup | 1 dia | Projeto configurado e deployado |
| 2. Design System | 2-3 dias | Shell visual premium |
| 3. Auth | 1-2 dias | Login + e-mails funcionando |
| 4. Banco de Dados | 1-2 dias | Schema completo com seeds |
| 5. Área do Aluno | 3-4 dias | Todas as telas do aluno |
| 6. Controle de Acesso | 1 dia | Proteção de rotas validada |
| 7. Webhook Hubla | 2 dias | Integração end-to-end |
| 8. Área Admin | 3-4 dias | Gestão completa |
| 9. Finalização | 2 dias | Pronto para produção |
| **Total** | **~17-20 dias** | |
