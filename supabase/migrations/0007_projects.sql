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
