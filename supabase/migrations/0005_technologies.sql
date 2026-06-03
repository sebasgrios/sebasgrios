create table technologies (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  label      text not null,
  icon_key   text,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);
