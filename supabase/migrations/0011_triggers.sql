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
