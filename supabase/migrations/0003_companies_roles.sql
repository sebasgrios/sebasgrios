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
