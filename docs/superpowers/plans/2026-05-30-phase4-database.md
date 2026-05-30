# Fase 4 — Banco de Dados — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Schema PostgreSQL completo no Supabase com todas as tabelas, índices, RLS policies, trigger de criação de perfil e dados de seed para desenvolvimento.

**Architecture:** Migrations SQL executadas diretamente no Supabase SQL Editor (ou via Supabase CLI). RLS como defense-in-depth. Seed cria 2 cursos com módulos/aulas, 2 produtos (single/combo), 1 admin e 2 alunos com matrículas distintas.

**Tech Stack:** PostgreSQL, Supabase SQL Editor / Supabase CLI.

**Pré-requisito:** Projeto Supabase criado, variáveis de ambiente configuradas.

---

## File Map

```
supabase/
├── migrations/
│   ├── 001_profiles.sql
│   ├── 002_courses_modules_lessons.sql
│   ├── 003_products.sql
│   ├── 004_enrollments_purchases.sql
│   ├── 005_webhook_events.sql
│   ├── 006_lesson_progress_materials.sql
│   ├── 007_indexes.sql
│   ├── 008_rls_policies.sql
│   └── 009_trigger_profile.sql
└── seed.sql
```

---

## Task 1: Migration — Profiles

- [ ] **Step 1.1: Criar `supabase/migrations/001_profiles.sql`**

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text,
  email       text UNIQUE NOT NULL,
  avatar_url  text,
  role        text NOT NULL DEFAULT 'student'
              CHECK (role IN ('student', 'admin', 'support')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
```

- [ ] **Step 1.2: Executar no Supabase SQL Editor**

Abrir Supabase Dashboard → SQL Editor → colar e executar o SQL acima.
Verificar em Table Editor que a tabela `profiles` aparece.

- [ ] **Step 1.3: Commit**

```bash
git add supabase/migrations/001_profiles.sql
git commit -m "db: create profiles table"
```

---

## Task 2: Migration — Courses, Modules, Lessons

- [ ] **Step 2.1: Criar e executar `supabase/migrations/002_courses_modules_lessons.sql`**

```sql
CREATE TABLE IF NOT EXISTS public.courses (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text UNIQUE NOT NULL,
  title            text NOT NULL,
  description      text,
  thumbnail_url    text,
  trailer_panda_id text,
  status           text NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft', 'published')),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.modules (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  order_index int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id        uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title            text NOT NULL,
  panda_video_id   text NOT NULL,
  duration_seconds int NOT NULL DEFAULT 0,
  order_index      int NOT NULL DEFAULT 0,
  is_preview       bool NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
```

- [ ] **Step 2.2: Executar no Supabase SQL Editor e verificar as 3 tabelas criadas**

- [ ] **Step 2.3: Commit**

```bash
git add supabase/migrations/002_courses_modules_lessons.sql
git commit -m "db: create courses, modules, lessons tables"
```

---

## Task 3: Migration — Products

- [ ] **Step 3.1: Criar e executar `supabase/migrations/003_products.sql`**

```sql
CREATE TABLE IF NOT EXISTS public.products (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hubla_product_id text UNIQUE NOT NULL,
  name             text NOT NULL,
  type             text NOT NULL DEFAULT 'single'
                   CHECK (type IN ('single', 'combo')),
  active           bool NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_courses (
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  course_id  uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, course_id)
);
```

- [ ] **Step 3.2: Executar e verificar**

- [ ] **Step 3.3: Commit**

```bash
git add supabase/migrations/003_products.sql
git commit -m "db: create products and product_courses tables"
```

---

## Task 4: Migration — Enrollments e Purchases

- [ ] **Step 4.1: Criar e executar `supabase/migrations/004_enrollments_purchases.sql`**

```sql
CREATE TABLE IF NOT EXISTS public.enrollments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id   uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status      text NOT NULL DEFAULT 'active'
              CHECK (status IN ('active', 'revoked', 'expired')),
  granted_by  text NOT NULL DEFAULT 'webhook'
              CHECK (granted_by IN ('webhook', 'manual')),
  granted_at  timestamptz NOT NULL DEFAULT now(),
  revoked_at  timestamptz,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.purchases (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id     uuid REFERENCES public.products(id),
  hubla_order_id text UNIQUE NOT NULL,
  amount_cents   int NOT NULL DEFAULT 0,
  status         text NOT NULL DEFAULT 'approved'
                 CHECK (status IN ('approved', 'refunded', 'cancelled')),
  purchased_at   timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
```

- [ ] **Step 4.2: Executar e verificar**

- [ ] **Step 4.3: Commit**

```bash
git add supabase/migrations/004_enrollments_purchases.sql
git commit -m "db: create enrollments and purchases tables"
```

---

## Task 5: Migration — Webhook Events, Lesson Progress, Materials

- [ ] **Step 5.1: Criar e executar `supabase/migrations/005_webhook_events.sql`**

```sql
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hubla_event_id text UNIQUE NOT NULL,
  event_type     varchar(100) NOT NULL,
  payload        jsonb NOT NULL,
  processed      bool NOT NULL DEFAULT false,
  error          text,
  received_at    timestamptz NOT NULL DEFAULT now()
);
```

- [ ] **Step 5.2: Criar e executar `supabase/migrations/006_lesson_progress_materials.sql`**

```sql
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id       uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed       bool NOT NULL DEFAULT false,
  watched_seconds int NOT NULL DEFAULT 0,
  last_watched_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS public.materials (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id  uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_id  uuid REFERENCES public.modules(id),
  lesson_id  uuid REFERENCES public.lessons(id),
  title      text NOT NULL,
  file_url   text NOT NULL,
  type       text NOT NULL DEFAULT 'pdf'
             CHECK (type IN ('pdf', 'link', 'zip')),
  created_at timestamptz NOT NULL DEFAULT now()
);
```

- [ ] **Step 5.3: Commit**

```bash
git add supabase/migrations/005_webhook_events.sql supabase/migrations/006_lesson_progress_materials.sql
git commit -m "db: create webhook_events, lesson_progress, materials tables"
```

---

## Task 6: Índices e RLS Policies

- [ ] **Step 6.1: Criar e executar `supabase/migrations/007_indexes.sql`**

```sql
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id  ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id   ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status      ON public.enrollments(status);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_student ON public.lesson_progress(student_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_slug     ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_lessons_module_order    ON public.lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_modules_course_order    ON public.modules(course_id, order_index);
```

- [ ] **Step 6.2: Criar e executar `supabase/migrations/008_rls_policies.sql`**

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials       ENABLE ROW LEVEL SECURITY;

-- profiles: aluno vê apenas o próprio perfil
CREATE POLICY "own_profile_select" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "own_profile_update" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- courses: alunos com matrícula ativa podem ver cursos publicados
CREATE POLICY "enrolled_courses_select" ON public.courses
  FOR SELECT USING (
    status = 'published' AND EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.course_id = courses.id
        AND enrollments.student_id = auth.uid()
        AND enrollments.status = 'active'
    )
  );

-- modules: visíveis se tiver matrícula no curso
CREATE POLICY "enrolled_modules_select" ON public.modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.course_id = modules.course_id
        AND enrollments.student_id = auth.uid()
        AND enrollments.status = 'active'
    )
  );

-- lessons: visíveis se tiver matrícula no curso do módulo
CREATE POLICY "enrolled_lessons_select" ON public.lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modules m
      JOIN public.enrollments e ON e.course_id = m.course_id
      WHERE m.id = lessons.module_id
        AND e.student_id = auth.uid()
        AND e.status = 'active'
    )
  );

-- enrollments: aluno vê apenas as próprias
CREATE POLICY "own_enrollments_select" ON public.enrollments
  FOR SELECT USING (student_id = auth.uid());

-- lesson_progress: aluno gerencia apenas o próprio progresso
CREATE POLICY "own_progress_all" ON public.lesson_progress
  FOR ALL USING (student_id = auth.uid());

-- purchases: aluno vê apenas as próprias compras
CREATE POLICY "own_purchases_select" ON public.purchases
  FOR SELECT USING (student_id = auth.uid());

-- materials: visíveis se tiver matrícula no curso
CREATE POLICY "enrolled_materials_select" ON public.materials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.course_id = materials.course_id
        AND enrollments.student_id = auth.uid()
        AND enrollments.status = 'active'
    )
  );

-- webhook_events: apenas service_role (sem policy pública)
-- products/product_courses: leitura pública para alunos verem produtos disponíveis
CREATE POLICY "products_select_all" ON public.products
  FOR SELECT USING (active = true);

CREATE POLICY "product_courses_select_all" ON public.product_courses
  FOR SELECT USING (true);
```

- [ ] **Step 6.3: Commit**

```bash
git add supabase/migrations/007_indexes.sql supabase/migrations/008_rls_policies.sql
git commit -m "db: add indexes and RLS policies"
```

---

## Task 7: Trigger de Criação de Profile

- [ ] **Step 7.1: Criar e executar `supabase/migrations/009_trigger_profile.sql`**

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

- [ ] **Step 7.2: Testar o trigger**

No SQL Editor:
```sql
-- Verificar que o trigger existe
SELECT trigger_name FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth';
```

Esperado: `on_auth_user_created` na lista.

- [ ] **Step 7.3: Commit**

```bash
git add supabase/migrations/009_trigger_profile.sql
git commit -m "db: add trigger to auto-create profile on user signup"
```

---

## Task 8: Seed de Desenvolvimento

- [ ] **Step 8.1: Criar `supabase/seed.sql`**

```sql
-- SEED DE DESENVOLVIMENTO
-- Executar APENAS em ambiente de desenvolvimento

-- Limpar dados existentes (ordem inversa das FKs)
TRUNCATE TABLE public.lesson_progress CASCADE;
TRUNCATE TABLE public.materials CASCADE;
TRUNCATE TABLE public.webhook_events CASCADE;
TRUNCATE TABLE public.purchases CASCADE;
TRUNCATE TABLE public.enrollments CASCADE;
TRUNCATE TABLE public.product_courses CASCADE;
TRUNCATE TABLE public.products CASCADE;
TRUNCATE TABLE public.lessons CASCADE;
TRUNCATE TABLE public.modules CASCADE;
TRUNCATE TABLE public.courses CASCADE;

-- Cursos
INSERT INTO public.courses (id, slug, title, description, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'curso-1', 'Curso 1 — Fundamentos', 'Aprenda os fundamentos do zero.', 'published'),
  ('22222222-2222-2222-2222-222222222222', 'curso-2', 'Curso 2 — Avançado', 'Técnicas avançadas para profissionais.', 'published');

-- Módulos do Curso 1
INSERT INTO public.modules (id, course_id, title, order_index) VALUES
  ('aaaa0001-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'Módulo 1 — Introdução', 0),
  ('aaaa0002-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'Módulo 2 — Conceitos Base', 1);

-- Aulas do Módulo 1 do Curso 1
INSERT INTO public.lessons (module_id, title, panda_video_id, duration_seconds, order_index, is_preview) VALUES
  ('aaaa0001-0000-0000-0000-000000000000', 'Aula 1.1 — Boas-vindas', 'panda-video-id-001', 300, 0, true),
  ('aaaa0001-0000-0000-0000-000000000000', 'Aula 1.2 — Configuração', 'panda-video-id-002', 600, 1, false),
  ('aaaa0001-0000-0000-0000-000000000000', 'Aula 1.3 — Primeiro projeto', 'panda-video-id-003', 900, 2, false);

-- Aulas do Módulo 2 do Curso 1
INSERT INTO public.lessons (module_id, title, panda_video_id, duration_seconds, order_index) VALUES
  ('aaaa0002-0000-0000-0000-000000000000', 'Aula 2.1 — Conceito A', 'panda-video-id-004', 450, 0),
  ('aaaa0002-0000-0000-0000-000000000000', 'Aula 2.2 — Conceito B', 'panda-video-id-005', 750, 1);

-- Módulo do Curso 2
INSERT INTO public.modules (id, course_id, title, order_index) VALUES
  ('bbbb0001-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'Módulo 1 — Avançado', 0);

INSERT INTO public.lessons (module_id, title, panda_video_id, duration_seconds, order_index) VALUES
  ('bbbb0001-0000-0000-0000-000000000000', 'Aula Avançada 1', 'panda-video-id-adv-001', 1200, 0),
  ('bbbb0001-0000-0000-0000-000000000000', 'Aula Avançada 2', 'panda-video-id-adv-002', 1500, 1);

-- Produtos Hubla
INSERT INTO public.products (id, hubla_product_id, name, type) VALUES
  ('prod0001-0000-0000-0000-000000000000', 'hubla-prod-curso1', 'Curso 1', 'single'),
  ('prod0002-0000-0000-0000-000000000000', 'hubla-prod-combo', 'Combo Curso 1 + 2', 'combo');

-- Mapeamento produto → cursos
INSERT INTO public.product_courses (product_id, course_id) VALUES
  ('prod0001-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'),
  ('prod0002-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'),
  ('prod0002-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222');

-- NOTA: Profiles e enrollments de seed são criados manualmente após criar
-- os usuários reais via Supabase Auth dashboard ou via script separado.
-- Ver Task 8.2 abaixo.
```

- [ ] **Step 8.2: Criar usuários de teste e matrículas**

No Supabase Dashboard → Authentication → Users → "Add user":

1. Criar `admin@plataforma.com` / senha: `Admin123!`
2. Criar `aluno1@plataforma.com` / senha: `Aluno123!`
3. Criar `aluno2@plataforma.com` / senha: `Aluno123!`

Copiar os UUIDs gerados. Depois no SQL Editor:

```sql
-- Substituir os UUIDs pelos IDs reais criados acima
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@plataforma.com';

-- Matrícula: aluno1 tem apenas Curso 1
INSERT INTO public.enrollments (student_id, course_id, granted_by)
SELECT p.id, '11111111-1111-1111-1111-111111111111', 'manual'
FROM public.profiles p WHERE p.email = 'aluno1@plataforma.com';

-- Matrícula: aluno2 tem ambos os cursos (combo)
INSERT INTO public.enrollments (student_id, course_id, granted_by)
SELECT p.id, '11111111-1111-1111-1111-111111111111', 'manual'
FROM public.profiles p WHERE p.email = 'aluno2@plataforma.com';

INSERT INTO public.enrollments (student_id, course_id, granted_by)
SELECT p.id, '22222222-2222-2222-2222-222222222222', 'manual'
FROM public.profiles p WHERE p.email = 'aluno2@plataforma.com';

-- Admin role
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@plataforma.com';
```

- [ ] **Step 8.3: Verificar seed com queries de teste**

```sql
-- Verificar matrículas
SELECT p.email, c.title, e.status
FROM enrollments e
JOIN profiles p ON p.id = e.student_id
JOIN courses c ON c.id = e.course_id
ORDER BY p.email;

-- Esperado:
-- aluno1@plataforma.com | Curso 1 — Fundamentos | active
-- aluno2@plataforma.com | Curso 1 — Fundamentos | active
-- aluno2@plataforma.com | Curso 2 — Avançado    | active
```

- [ ] **Step 8.4: Commit**

```bash
git add supabase/seed.sql
git commit -m "db: add development seed with courses, modules, lessons, products, enrollments"
```

---

## Verificação Final da Fase 4

- [ ] Todas as 10 tabelas existem no Supabase
- [ ] Trigger `on_auth_user_created` funciona (criar user → profile aparece)
- [ ] RLS habilitado em todas as tabelas
- [ ] Seed executado com sucesso
- [ ] Query de verificação retorna matrículas corretas
- [ ] `npx tsc --noEmit` sem erros

---

## Próxima Fase

→ **[Fase 5 — Área do Aluno](2026-05-30-phase5-student-area.md)**
