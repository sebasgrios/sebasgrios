# 06 · Data schema (Supabase)

Postgres con extensiones `pgcrypto` (uuid) habilitadas. Todas las tablas con `RLS ON`.

Convenciones:
- Tablas y columnas en `snake_case`.
- PK `id uuid default gen_random_uuid()`.
- Todas las tablas con `created_at timestamptz default now()`.
- `profile`, `projects`, `roles`, `education` tienen `updated_at timestamptz default now()` con trigger.
- Campos traducibles: `jsonb` con shape `{"es": "...", "en": "..."}`. Constraint CHECK valida que las dos claves existen.

## Tablas

### `profile`

```sql
create table profile (
  id                    uuid primary key default gen_random_uuid(),
  full_name             text not null,
  short_name            text not null,
  role                  jsonb not null,
  lead                  jsonb not null,
  status_label          jsonb not null,
  is_open_to_work       boolean not null default true,
  hero_badges           jsonb not null default '[]'::jsonb,
  experience_start_date date not null,
  avatar_url            text,
  photo_url             text,
  email                 text not null,
  linkedin_url          text,
  github_url            text,
  contact_title         jsonb not null,
  contact_lead          jsonb not null,
  meta_title            jsonb not null,
  meta_description      jsonb not null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  -- enforce singleton
  is_singleton          boolean generated always as (true) stored,
  constraint profile_singleton unique (is_singleton),
  constraint profile_role_locales check (role ? 'es' and role ? 'en'),
  constraint profile_lead_locales check (lead ? 'es' and lead ? 'en'),
  constraint profile_status_locales check (status_label ? 'es' and status_label ? 'en'),
  constraint profile_contact_title_locales check (contact_title ? 'es' and contact_title ? 'en'),
  constraint profile_contact_lead_locales check (contact_lead ? 'es' and contact_lead ? 'en'),
  constraint profile_meta_title_locales check (meta_title ? 'es' and meta_title ? 'en'),
  constraint profile_meta_description_locales check (meta_description ? 'es' and meta_description ? 'en')
);
```

### `companies`

```sql
create table companies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_url    text,
  meta_line   jsonb not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  constraint companies_meta_line_locales check (meta_line ? 'es' and meta_line ? 'en')
);
create index companies_sort_order_idx on companies (sort_order desc);
```

### `roles`

```sql
create table roles (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references companies(id) on delete cascade,
  title       jsonb not null,
  sector      jsonb not null,
  mode        jsonb not null,
  mode_key    text not null check (mode_key in ('remote', 'onsite', 'hybrid')),
  start_date  date not null,
  end_date    date,
  description jsonb not null,
  bullets     jsonb not null default '[]'::jsonb,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint roles_title_locales check (title ? 'es' and title ? 'en'),
  constraint roles_sector_locales check (sector ? 'es' and sector ? 'en'),
  constraint roles_mode_locales check (mode ? 'es' and mode ? 'en'),
  constraint roles_description_locales check (description ? 'es' and description ? 'en')
);
create index roles_company_idx on roles (company_id);
create index roles_sort_order_idx on roles (sort_order desc);
```

### `education`

```sql
create table education (
  id          uuid primary key default gen_random_uuid(),
  title       jsonb not null,
  school      text not null,
  start_date  date not null,
  end_date    date,
  description jsonb not null,
  bullets     jsonb not null default '[]'::jsonb,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint education_title_locales check (title ? 'es' and title ? 'en'),
  constraint education_description_locales check (description ? 'es' and description ? 'en')
);
```

### `technologies`

```sql
create table technologies (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  label      text not null,
  icon_key   text,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);
```

### `stack_groups`

```sql
create table stack_groups (
  id         uuid primary key default gen_random_uuid(),
  label      jsonb not null,
  icon_key   text not null,
  sort_order int  not null default 0,
  created_at timestamptz not null default now(),
  constraint stack_groups_label_locales check (label ? 'es' and label ? 'en')
);
```

### `projects`

```sql
create table projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description jsonb not null,
  image_url   text,
  live_url    text,
  code_url    text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint projects_description_locales check (description ? 'es' and description ? 'en')
);
```

### Pivots

```sql
create table role_technologies (
  role_id       uuid not null references roles(id) on delete cascade,
  technology_id uuid not null references technologies(id) on delete cascade,
  sort_order    int  not null default 0,
  primary key (role_id, technology_id)
);

create table education_technologies (
  education_id  uuid not null references education(id) on delete cascade,
  technology_id uuid not null references technologies(id) on delete cascade,
  sort_order    int  not null default 0,
  primary key (education_id, technology_id)
);

create table stack_group_technologies (
  stack_group_id uuid not null references stack_groups(id) on delete cascade,
  technology_id  uuid not null references technologies(id) on delete cascade,
  sort_order     int  not null default 0,
  primary key (stack_group_id, technology_id)
);

create table project_technologies (
  project_id    uuid not null references projects(id) on delete cascade,
  technology_id uuid not null references technologies(id) on delete cascade,
  sort_order    int  not null default 0,
  primary key (project_id, technology_id)
);
```

## Roles (autorización admin)

```sql
create table user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role    text not null check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);
```

## RLS

Habilitar en todas las tablas:

```sql
alter table profile                  enable row level security;
alter table companies                enable row level security;
alter table roles                    enable row level security;
alter table education                enable row level security;
alter table technologies             enable row level security;
alter table stack_groups             enable row level security;
alter table projects                 enable row level security;
alter table role_technologies        enable row level security;
alter table education_technologies   enable row level security;
alter table stack_group_technologies enable row level security;
alter table project_technologies     enable row level security;
alter table user_roles               enable row level security;
```

### Políticas

**Lectura pública anónima** en todas las tablas excepto `user_roles`:

```sql
create policy "public read profile"
  on profile for select using (true);
-- repetir para companies, roles, education, technologies,
-- stack_groups, projects, role_technologies, education_technologies,
-- stack_group_technologies, project_technologies
```

**Escritura solo admins** (vía función helper):

```sql
create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

create policy "admin write profile"
  on profile for all
  using (is_admin())
  with check (is_admin());
-- repetir para el resto
```

`user_roles`: solo el propio usuario puede leer su row; nadie puede escribir (se siembra a mano desde el dashboard de Supabase para el primer admin).

## Triggers

Trigger genérico para `updated_at`:

```sql
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profile_updated   before update on profile   for each row execute function set_updated_at();
create trigger trg_roles_updated     before update on roles     for each row execute function set_updated_at();
create trigger trg_education_updated before update on education for each row execute function set_updated_at();
create trigger trg_projects_updated  before update on projects  for each row execute function set_updated_at();
```

## Storage buckets

| Bucket | Público | Uso |
|---|---|---|
| `avatars` | sí | Avatar del nav. |
| `hero` | sí | Foto principal del hero. |
| `companies` | sí | Logos de empresas (jpeg/png). |
| `projects` | sí | Capturas de proyectos. |

Política de bucket: select público; insert/update/delete solo admin.

## Migraciones (orden)

```
supabase/migrations/
  0001_extensions.sql
  0002_profile.sql
  0003_companies_roles.sql
  0004_education.sql
  0005_technologies.sql
  0006_stack_groups.sql
  0007_projects.sql
  0008_pivots.sql
  0009_user_roles.sql
  0010_rls_policies.sql
  0011_triggers.sql
  0012_storage_buckets.sql
  0013_set_entity_technologies.sql   # RPC: sync atómico de pivots M:N
  0014_admin_audit_log.sql           # tabla de auditoría del backoffice
```

## RPC `set_entity_technologies`

Función `security invoker` que reemplaza la sincronización de pivots de tecnologías en una sola transacción: `delete` + `insert` (con `sort_order` por orden de la lista). Whitelist de tablas pivot (`role_/education_/stack_group_/project_technologies`). RLS aplica (admin write). La llaman los repos de mutación vía `client.rpc('set_entity_technologies', { p_table, p_fk, p_id, p_ids })`.

## `admin_audit_log`

```sql
create table admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) default auth.uid(),
  entity text not null, action text not null, entity_id uuid,
  created_at timestamptz not null default now()
);
```

RLS: lectura + insert solo admin (`is_admin()`). El backoffice (repo aparte) inserta (best-effort) tras cada mutación. `user_id` se rellena solo con `auth.uid()`.

## Seed

`/supabase/seed.sql` carga el contenido inicial (1 profile, 2 companies, 4 roles, 3 educations, 6 stack groups, ~20 technologies, 4 projects).

Reset local:
```bash
supabase db reset    # aplica migraciones + seed
```

## Tipos generados

```bash
supabase gen types typescript --linked > src/lib/data/database.types.ts
```

Se commitea. Se regenera cuando se aplique una migración nueva.

## Operación con la Supabase CLI local

El ingeniero ya tiene la CLI instalada. Claude opera siempre a través de ella; nunca pide secrets ni inserta SQL desde el dashboard salvo en pasos marcados explícitamente como manuales (p. ej. habilitar OAuth).

Comandos relevantes:

```bash
supabase login                  # una vez por sesión de usuario
supabase init                   # solo la primera vez en el repo
supabase link --project-ref <ref>   # vincular a un proyecto remoto existente
supabase projects create        # crear un proyecto nuevo (M4)
supabase db push                # aplicar migraciones pendientes al linked
supabase db reset               # reset local (drop + migraciones + seed)
supabase gen types typescript --linked > src/lib/data/database.types.ts
```

Cualquier acción que cree o destruya datos remotos se confirma con el ingeniero antes.

## Notas de diseño del schema

- **Singleton `profile`**: usar `generated stored` column + unique constraint para garantizar exactamente 1 row sin disparadores.
- **`is_open_to_work`** separado del label porque a veces el label se cambia ("Disponible Q1", "En transición") sin tocar el indicador.
- **Pivots con `sort_order`**: el ingeniero quiere controlar el orden visual de los tags.
- **Sin tabla `socials`** independiente: 99% de los casos son linkedin + github + email, viven en `profile`. Si crece, se extrae.
- **Sin columnas de auditoría detalladas** (created_by, updated_by): el ingeniero es el único editor por ahora.
