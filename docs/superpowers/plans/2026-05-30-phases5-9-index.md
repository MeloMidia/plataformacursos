# Fases 5–9 — Índice dos Planos Restantes

> Os planos das fases 5–9 são escritos imediatamente antes de iniciar cada fase, garantindo que os detalhes de implementação estejam alinhados com o estado real do código naquele momento.

---

## Fase 5 — Área do Aluno

**Arquivo:** `2026-05-30-phase5-student-area.md` (a criar)

**Escopo:**
- `components/student/CourseCard.tsx` — card com thumbnail, título, progresso
- `components/student/LockedCourseCard.tsx` — card com overlay de cadeado
- `components/student/ContinueWatchingCard.tsx` — card horizontal última aula
- `components/student/CourseHero.tsx` — hero com thumbnail gradient + progresso amarelo
- `components/student/ModuleAccordion.tsx` — accordion de módulos (Shadcn Accordion)
- `components/student/LessonItem.tsx` — item de aula: ícone, título, duração, status
- `components/student/LessonPlayer.tsx` — iframe Panda Video responsivo 16:9
- `components/student/ProgressBar.tsx` — barra amarela de progresso
- `components/student/StatusBadge.tsx` — badge Ativo/Revogado/Novo
- `app/(student)/dashboard/page.tsx` — dados reais do Supabase
- `app/(student)/meus-cursos/page.tsx` — grid de cursos + locked cards
- `app/(student)/curso/[slug]/page.tsx` — hero + módulos + aulas
- `app/(student)/curso/[slug]/aula/[lessonId]/page.tsx` — player + nav
- `app/(student)/continuar-assistindo/page.tsx` — lista de aulas em progresso
- `app/(student)/materiais/page.tsx` — lista de materiais por curso
- `lib/actions/progress.ts` — Server Action para upsert lesson_progress

**Dependência:** Fase 4 completa (dados reais no banco).

---

## Fase 6 — Controle de Acesso por Curso

**Arquivo:** `2026-05-30-phase6-access-control.md` (a criar)

**Escopo:**
- `app/(student)/curso/[slug]/layout.tsx` — verifica enrollment ativo, renderiza AccessDenied se bloqueado
- `components/student/AccessDenied.tsx` — tela de bloqueio premium com CTA
- `components/student/UpgradeCTA.tsx` — card de upgrade com link Hubla
- Testes manuais de todos os cenários: sem matrícula, revogado, ativo
- Verificação RLS: acesso direto ao Supabase sem enrollment deve retornar vazio

**Dependência:** Fase 5 completa.

---

## Fase 7 — Integração com Webhook da Hubla

**Arquivo:** `2026-05-30-phase7-webhook.md` (a criar)

**Escopo:**
- `app/api/webhooks/hubla/route.ts` — handler completo
- `lib/webhook/validate.ts` — HMAC-SHA256 validation
- `lib/webhook/handlers/grant-access.ts` — criar user + enrollment
- `lib/webhook/handlers/revoke-access.ts` — revogar enrollment
- `lib/webhook/idempotency.ts` — check/insert webhook_events
- Testes com `curl` simulando payloads
- Testes de idempotência (mesmo payload 2x)
- Teste de reembolso (enrollment revogado)
- Resend: e-mail de boas-vindas disparado no grant

**Dependência:** Fases 3, 4 e 6 completas.

---

## Fase 8 — Área Administrativa

**Arquivo:** `2026-05-30-phase8-admin.md` (a criar)

**Escopo:**
- `app/(admin)/admin/page.tsx` — métricas: alunos, vendas do mês, cursos ativos
- `app/(admin)/admin/cursos/` — CRUD de cursos + módulos + aulas (drag-and-drop order)
- `app/(admin)/admin/alunos/` — lista + busca + perfil + concessão/revogação manual
- `app/(admin)/admin/vendas/` — tabela de purchases com filtros
- `app/(admin)/admin/webhooks/` — log de webhook_events + reprocessar
- `app/(admin)/admin/produtos/` — CRUD de produtos + mapeamento para cursos
- `lib/actions/admin/` — Server Actions para todas as operações admin
- Verificação de role=admin no `/(admin)/layout.tsx`

**Dependência:** Fases 4, 5 e 7 completas.

---

## Fase 9 — Tracking, E-mails e Finalização

**Arquivo:** `2026-05-30-phase9-finalization.md` (a criar)

**Escopo:**
- `lib/utils/progress.ts` — calcular course_progress (%) via lesson_progress
- Exibir progresso em CourseCard, CourseHero, dashboard
- Marcar curso como "Concluído" quando 100%
- Skeletons em todos os componentes de dados
- Estados vazios (sem cursos, sem progresso)
- Toasts de sucesso/erro em todas as actions
- Testes de responsividade mobile/tablet
- Otimização: `loading.tsx` em todas as rotas pesadas
- Auditoria de segurança: Server Actions com session check
- Deploy de produção: domínio customizado + variáveis de produção
- Teste end-to-end completo da jornada do aluno

---

## Ordem de Execução

```
Fase 1 (Setup) → Fase 2 (Design) → Fase 3 (Auth) → Fase 4 (DB)
→ Fase 5 (Aluno) → Fase 6 (Acesso) → Fase 7 (Webhook)
→ Fase 8 (Admin) → Fase 9 (Final)
```

Cada fase entrega software testável e funcional. Não pular fases — cada uma depende da anterior.
