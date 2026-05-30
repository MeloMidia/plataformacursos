# Rotas e Permissões

## Visão geral das camadas de proteção

```
Camada 1: middleware.ts (Edge)
  → Verifica JWT do cookie Supabase
  → Sem sessão → redirect /login
  → Com sessão em rota pública (/login) → redirect /dashboard

Camada 2: Layout Server Component
  → /(student)/curso/[slug]/layout.tsx verifica enrollment ativo
  → /(admin)/layout.tsx verifica role = 'admin'
  → /(admin)/layout.tsx com role = 'support' → acesso limitado

Camada 3: RLS PostgreSQL (defense in depth)
  → Aluno só lê suas próprias rows em enrollments, lesson_progress, profiles
```

---

## Páginas Públicas (sem autenticação)

| Rota | Descrição | Componentes |
|---|---|---|
| `/login` | Formulário de login com e-mail e senha | LoginForm |
| `/forgot-password` | Solicitar reset de senha | ForgotPasswordForm |
| `/reset-password` | Definir nova senha (via link do e-mail) | ResetPasswordForm |

**Comportamento:** Se o usuário já estiver logado ao acessar estas rotas, o middleware redireciona para `/dashboard`.

---

## Área do Aluno (requer autenticação — role: student, admin, support)

| Rota | Descrição | Verificação Extra |
|---|---|---|
| `/dashboard` | Home do aluno: cursos recentes, continuar assistindo | Nenhuma |
| `/continuar-assistindo` | Lista de aulas em progresso | Nenhuma |
| `/meus-cursos` | Todos os cursos com matrícula ativa | Nenhuma |
| `/curso/[slug]` | Página do curso: hero, módulos, aulas | enrollment ativo |
| `/curso/[slug]/aula/[lessonId]` | Player da aula + navegação | enrollment ativo |
| `/materiais` | Materiais de apoio dos cursos matriculados | Nenhuma |
| `/suporte` | Formulário/link de suporte | Nenhuma |
| `/minha-conta` | Editar perfil, avatar, senha | Nenhuma |

### Proteção de `/curso/[slug]` e subrotas

```typescript
// /(student)/curso/[slug]/layout.tsx
const { data: enrollment } = await supabase
  .from('enrollments')
  .select('status')
  .eq('student_id', user.id)
  .eq('course_id', course.id)
  .eq('status', 'active')
  .single()

if (!enrollment) {
  // Renderiza AccessDenied com UpgradeCTA
  // NÃO faz redirect — mantém URL para UX de upgrade
  return <AccessDenied course={course} />
}
```

### Cursos bloqueados na vitrine

Cursos sem matrícula **aparecem** na vitrine (`/meus-cursos`, `/dashboard`) como `LockedCourseCard` com:
- Cadeado sobre a thumbnail
- Botão "Desbloquear" → link externo para compra na Hubla
- Sem acesso a nenhuma rota de aula

---

## Área Administrativa (requer role: admin)

| Rota | Descrição | Permissão |
|---|---|---|
| `/admin` | Dashboard admin: métricas gerais | admin |
| `/admin/cursos` | Listar todos os cursos | admin |
| `/admin/cursos/novo` | Criar novo curso | admin |
| `/admin/cursos/[id]` | Editar curso, módulos, aulas | admin |
| `/admin/alunos` | Listar alunos, buscar por e-mail | admin, support |
| `/admin/alunos/[id]` | Perfil do aluno: matrículas, progresso, compras | admin, support |
| `/admin/vendas` | Histórico de compras e reembolsos | admin, support |
| `/admin/webhooks` | Log de webhook_events | admin |
| `/admin/produtos` | Gerenciar produtos Hubla e mapeamento courses | admin |

### Controle manual de acesso (admin only)

Na página `/admin/alunos/[id]`, o admin pode:
- **Conceder acesso** a qualquer curso (cria enrollment com `granted_by='manual'`)
- **Revogar acesso** a qualquer curso (atualiza enrollment status='revoked')
- Ação é independente da Hubla — para cortesias, suporte, trocas

---

## Endpoint de Webhook

| Rota | Método | Autenticação |
|---|---|---|
| `/api/webhooks/hubla` | POST | HMAC-SHA256 via header `X-Hubla-Signature` |

Não requer sessão de usuário. Usa `SUPABASE_SERVICE_ROLE_KEY` internamente.

---

## Tabela de Acesso por Role

| Área | student | support | admin |
|---|---|---|---|
| Área do aluno | ✅ próprios cursos | ✅ | ✅ |
| `/admin/alunos` | ❌ | ✅ view-only | ✅ full |
| `/admin/vendas` | ❌ | ✅ view-only | ✅ full |
| `/admin/cursos` | ❌ | ❌ | ✅ full |
| `/admin/webhooks` | ❌ | ❌ | ✅ full |
| `/admin/produtos` | ❌ | ❌ | ✅ full |
| Conceder/revogar acesso | ❌ | ❌ | ✅ |
| Criar/editar cursos | ❌ | ❌ | ✅ |

---

## Middleware (pseudocódigo)

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)
  const { data: { session } } = await supabase.auth.getSession()

  const isPublicRoute = ['/login', '/forgot-password', '/reset-password']
    .some(path => request.nextUrl.pathname.startsWith(path))

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

**Nota:** O middleware NÃO verifica role nem enrollment. Isso é responsabilidade dos layouts.
