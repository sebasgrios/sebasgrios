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

create policy "public read profile" on profile for select using (true);
create policy "public read companies" on companies for select using (true);
create policy "public read roles" on roles for select using (true);
create policy "public read education" on education for select using (true);
create policy "public read technologies" on technologies for select using (true);
create policy "public read stack_groups" on stack_groups for select using (true);
create policy "public read projects" on projects for select using (true);
create policy "public read role_technologies" on role_technologies for select using (true);
create policy "public read education_technologies" on education_technologies for select using (true);
create policy "public read stack_group_technologies" on stack_group_technologies for select using (true);
create policy "public read project_technologies" on project_technologies for select using (true);

create policy "admin write profile" on profile for all using (is_admin()) with check (is_admin());
create policy "admin write companies" on companies for all using (is_admin()) with check (is_admin());
create policy "admin write roles" on roles for all using (is_admin()) with check (is_admin());
create policy "admin write education" on education for all using (is_admin()) with check (is_admin());
create policy "admin write technologies" on technologies for all using (is_admin()) with check (is_admin());
create policy "admin write stack_groups" on stack_groups for all using (is_admin()) with check (is_admin());
create policy "admin write projects" on projects for all using (is_admin()) with check (is_admin());
create policy "admin write role_technologies" on role_technologies for all using (is_admin()) with check (is_admin());
create policy "admin write education_technologies" on education_technologies for all using (is_admin()) with check (is_admin());
create policy "admin write stack_group_technologies" on stack_group_technologies for all using (is_admin()) with check (is_admin());
create policy "admin write project_technologies" on project_technologies for all using (is_admin()) with check (is_admin());

create policy "self read user_roles" on user_roles for select using (auth.uid() = user_id);
