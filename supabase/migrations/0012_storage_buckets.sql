insert into storage.buckets (id, name, public)
values
  ('avatars',  'avatars',  true),
  ('hero',     'hero',     true),
  ('companies','companies',true),
  ('projects', 'projects', true)
on conflict (id) do nothing;

create policy "public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "public read hero"
  on storage.objects for select
  using (bucket_id = 'hero');

create policy "public read companies"
  on storage.objects for select
  using (bucket_id = 'companies');

create policy "public read projects"
  on storage.objects for select
  using (bucket_id = 'projects');

create policy "admin write avatars"
  on storage.objects for all
  using (bucket_id = 'avatars' and is_admin())
  with check (bucket_id = 'avatars' and is_admin());

create policy "admin write hero"
  on storage.objects for all
  using (bucket_id = 'hero' and is_admin())
  with check (bucket_id = 'hero' and is_admin());

create policy "admin write companies"
  on storage.objects for all
  using (bucket_id = 'companies' and is_admin())
  with check (bucket_id = 'companies' and is_admin());

create policy "admin write projects"
  on storage.objects for all
  using (bucket_id = 'projects' and is_admin())
  with check (bucket_id = 'projects' and is_admin());
