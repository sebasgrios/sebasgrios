create table role_technologies (
  role_id       uuid not null references roles(id) on delete cascade,
  technology_id uuid not null references technologies(id) on delete cascade,
  sort_order    int  not null default 0,
  primary key (role_id, technology_id)
);

create table education_technologies (
  education_id  uuid not null references education(id) on delete cascade,
  technology_id uuid not null references technologies(id) on delete cascade,
  sort_order    int  not null default 0,
  primary key (education_id, technology_id)
);

create table stack_group_technologies (
  stack_group_id uuid not null references stack_groups(id) on delete cascade,
  technology_id  uuid not null references technologies(id) on delete cascade,
  sort_order     int  not null default 0,
  primary key (stack_group_id, technology_id)
);

create table project_technologies (
  project_id    uuid not null references projects(id) on delete cascade,
  technology_id uuid not null references technologies(id) on delete cascade,
  sort_order    int  not null default 0,
  primary key (project_id, technology_id)
);
