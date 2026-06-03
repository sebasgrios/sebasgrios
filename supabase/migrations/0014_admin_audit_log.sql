create table admin_audit_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) default auth.uid(),
  entity     text not null,
  action     text not null,
  entity_id  uuid,
  created_at timestamptz not null default now()
);

create index admin_audit_log_created_at_idx on admin_audit_log (created_at desc);

alter table admin_audit_log enable row level security;

create policy "admin read audit_log"
  on admin_audit_log for select
  using (is_admin());

create policy "admin insert audit_log"
  on admin_audit_log for insert
  with check (is_admin());
