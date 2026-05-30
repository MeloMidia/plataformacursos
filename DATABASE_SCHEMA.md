# Database Schema

Banco de dados PostgreSQL via Supabase. Todas as tabelas usam `uuid` como PK gerado por `gen_random_uuid()`. Timestamps em `timestamptz`.

---

## Diagrama de Relacionamentos

```
auth.users (Supabase)
    │
    └─► profiles (1:1)
            │
            ├─► enrollments (N) ──────────► courses (N)
            │                                   │
            ├─► purchases (N)                   ├─► modules (N)
            │       │                           │       │
            │       └─► products (N)            │       └─► lessons (N)
            │               │                  │               │
            │               └─► product_courses─┘               ├─► lesson_progress (N)
            │                                                    └─► materials (N)
            └─► lesson_progress (N)

webhook_events (independente — log imutável)
```

---

## Tabelas

### `profiles`
Extensão do `auth.users`. Criada automaticamente via trigger após signup.

```sql
CREATE TABLE profiles (
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

---

### `courses`

```sql
CREATE TABLE courses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  title         text NOT NULL,
  description   text,
  thumbnail_url text,
  trailer_panda_id text,
  status        text NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft', 'published')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
```

---

### `modules`

```sql
CREATE TABLE modules (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  order_index int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);
```

---

### `lessons`

```sql
CREATE TABLE lessons (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id        uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title            text NOT NULL,
  panda_video_id   text NOT NULL,
  duration_seconds int NOT NULL DEFAULT 0,
  order_index      int NOT NULL DEFAULT 0,
  is_preview       bool NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
```

---

### `products`
Produtos cadastrados na Hubla. O `hubla_product_id` é o ID do produto na Hubla.

```sql
CREATE TABLE products (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hubla_product_id text UNIQUE NOT NULL,
  name             text NOT NULL,
  type             text NOT NULL DEFAULT 'single'
                        CHECK (type IN ('single', 'combo')),
  active           bool NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now()
);
```

---

### `product_courses`
Mapeia quais cursos um produto da Hubla desbloqueia.

```sql
CREATE TABLE product_courses (
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  course_id  uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, course_id)
);
```

---

### `enrollments`
Matrícula de um aluno em um curso. UNIQUE constraint garante uma única linha por (aluno, curso).

```sql
CREATE TABLE enrollments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id   uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status      text NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active', 'revoked', 'expired')),
  granted_by  text NOT NULL DEFAULT 'webhook'
                   CHECK (granted_by IN ('webhook', 'manual')),
  granted_at  timestamptz NOT NULL DEFAULT now(),
  revoked_at  timestamptz,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id)
);
```

---

### `purchases`
Registro de cada compra aprovada via Hubla.

```sql
CREATE TABLE purchases (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id     uuid REFERENCES products(id),
  hubla_order_id text UNIQUE NOT NULL,
  amount_cents   int NOT NULL DEFAULT 0,
  status         text NOT NULL DEFAULT 'approved'
                      CHECK (status IN ('approved', 'refunded', 'cancelled')),
  purchased_at   timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
```

---

### `webhook_events`
Log imutável de todos os eventos recebidos da Hubla. Nunca deletar ou atualizar payload.

```sql
CREATE TABLE webhook_events (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hubla_event_id text UNIQUE NOT NULL,
  event_type     varchar(100) NOT NULL,
  payload        jsonb NOT NULL,
  processed      bool NOT NULL DEFAULT false,
  error          text,
  received_at    timestamptz NOT NULL DEFAULT now()
);
```

**Idempotência:** Antes de processar qualquer webhook, verificar se `hubla_event_id` já existe. Se sim, retornar 200 sem processar novamente.

---

### `lesson_progress`
Progresso do aluno por aula. UPSERT via Server Action a cada interação com o player.

```sql
CREATE TABLE lesson_progress (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id       uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed       bool NOT NULL DEFAULT false,
  watched_seconds int NOT NULL DEFAULT 0,
  last_watched_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, lesson_id)
);
```

---

### `materials`
Materiais de apoio (PDFs, links, zips) associados a um curso, módulo ou aula.

```sql
CREATE TABLE materials (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id uuid REFERENCES modules(id),
  lesson_id uuid REFERENCES lessons(id),
  title     text NOT NULL,
  file_url  text NOT NULL,
  type      text NOT NULL DEFAULT 'pdf'
                 CHECK (type IN ('pdf', 'link', 'zip')),
  created_at timestamptz NOT NULL DEFAULT now()
);
```

---

## Índices recomendados

```sql
-- Consultas frequentes de acesso
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- Progresso do aluno
CREATE INDEX idx_lesson_progress_student_id ON lesson_progress(student_id);

-- Webhook lookup
CREATE UNIQUE INDEX idx_webhook_events_hubla_id ON webhook_events(hubla_event_id);

-- Cursos por slug
CREATE UNIQUE INDEX idx_courses_slug ON courses(slug);

-- Lessons por módulo ordenadas
CREATE INDEX idx_lessons_module_order ON lessons(module_id, order_index);
CREATE INDEX idx_modules_course_order ON modules(course_id, order_index);
```

---

## RLS Policies (defense in depth)

```sql
-- Aluno vê apenas suas próprias matrículas
CREATE POLICY "student_own_enrollments" ON enrollments
  FOR SELECT USING (student_id = auth.uid());

-- Aluno vê apenas seu próprio progresso
CREATE POLICY "student_own_progress" ON lesson_progress
  FOR ALL USING (student_id = auth.uid());

-- webhook_events: apenas service_role
-- (sem policy pública — acesso só via service key)

-- profiles: aluno vê apenas o próprio perfil
CREATE POLICY "own_profile" ON profiles
  FOR ALL USING (id = auth.uid());
```

---

## Trigger: criação automática de profile

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```
