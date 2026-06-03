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
create index education_sort_order_idx on education (sort_order desc);
