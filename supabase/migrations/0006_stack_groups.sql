create table stack_groups (
  id         uuid primary key default gen_random_uuid(),
  label      jsonb not null,
  icon_key   text not null,
  sort_order int  not null default 0,
  created_at timestamptz not null default now(),
  constraint stack_groups_label_locales check (label ? 'es' and label ? 'en')
);
