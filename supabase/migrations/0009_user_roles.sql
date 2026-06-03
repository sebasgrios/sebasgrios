create table user_roles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);
