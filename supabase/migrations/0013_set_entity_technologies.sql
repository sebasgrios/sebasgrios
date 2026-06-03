create or replace function set_entity_technologies(
  p_table text,
  p_fk text,
  p_id uuid,
  p_ids uuid[]
) returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if p_table not in (
    'role_technologies',
    'education_technologies',
    'stack_group_technologies',
    'project_technologies'
  ) then
    raise exception 'invalid pivot table %', p_table;
  end if;

  execute format('delete from %I where %I = $1', p_table, p_fk) using p_id;

  if array_length(p_ids, 1) is not null then
    execute format(
      'insert into %I (%I, technology_id, sort_order)
         select $1, t.id, (t.ord - 1)::int
         from unnest($2::uuid[]) with ordinality as t(id, ord)',
      p_table, p_fk
    ) using p_id, p_ids;
  end if;
end;
$$;
