import type {
  CompanyInput,
  EducationInput,
  ProfileInput,
  ProjectInput,
  RoleInput,
  StackGroupInput,
  TechnologyInput,
} from '@/lib/admin/schemas';
import type { SupabaseServerClient } from '@/lib/auth/supabaseServer';

function technologyRow(input: TechnologyInput) {
  return {
    key: input.key,
    label: input.label,
    icon_key: input.iconKey,
    sort_order: input.sortOrder,
  };
}

export async function createTechnology(
  client: SupabaseServerClient,
  input: TechnologyInput
): Promise<void> {
  const { error } = await client.from('technologies').insert(technologyRow(input));
  if (error) throw new Error(`technology create failed: ${error.message}`);
}

export async function updateTechnology(
  client: SupabaseServerClient,
  id: string,
  input: TechnologyInput
): Promise<void> {
  const { error } = await client.from('technologies').update(technologyRow(input)).eq('id', id);
  if (error) throw new Error(`technology update failed: ${error.message}`);
}

export async function deleteTechnology(client: SupabaseServerClient, id: string): Promise<void> {
  const { error } = await client.from('technologies').delete().eq('id', id);
  if (error) throw new Error(`technology delete failed: ${error.message}`);
}

type PivotTable =
  | 'role_technologies'
  | 'education_technologies'
  | 'stack_group_technologies'
  | 'project_technologies';

async function syncTechnologies(
  client: SupabaseServerClient,
  table: PivotTable,
  fk: string,
  id: string,
  technologyIds: string[]
): Promise<void> {
  const { error } = await client.rpc('set_entity_technologies', {
    p_table: table,
    p_fk: fk,
    p_id: id,
    p_ids: technologyIds,
  });
  if (error) throw new Error(`${table} sync failed: ${error.message}`);
}

export async function createStackGroup(
  client: SupabaseServerClient,
  input: StackGroupInput
): Promise<void> {
  const { data, error } = await client
    .from('stack_groups')
    .insert({ label: input.label, icon_key: input.iconKey, sort_order: input.sortOrder })
    .select('id')
    .single();
  if (error || !data) throw new Error(`stack group create failed: ${error?.message ?? 'no row'}`);
  await syncTechnologies(
    client,
    'stack_group_technologies',
    'stack_group_id',
    data.id,
    input.technologyIds
  );
}

export async function updateStackGroup(
  client: SupabaseServerClient,
  id: string,
  input: StackGroupInput
): Promise<void> {
  const { error } = await client
    .from('stack_groups')
    .update({ label: input.label, icon_key: input.iconKey, sort_order: input.sortOrder })
    .eq('id', id);
  if (error) throw new Error(`stack group update failed: ${error.message}`);
  await syncTechnologies(
    client,
    'stack_group_technologies',
    'stack_group_id',
    id,
    input.technologyIds
  );
}

export async function deleteStackGroup(client: SupabaseServerClient, id: string): Promise<void> {
  const { error } = await client.from('stack_groups').delete().eq('id', id);
  if (error) throw new Error(`stack group delete failed: ${error.message}`);
}

function educationRow(input: EducationInput) {
  return {
    title: input.title,
    school: input.school,
    start_date: input.startDate,
    end_date: input.endDate,
    description: input.description,
    bullets: input.bullets,
    sort_order: input.sortOrder,
  };
}

export async function createEducation(
  client: SupabaseServerClient,
  input: EducationInput
): Promise<void> {
  const { data, error } = await client
    .from('education')
    .insert(educationRow(input))
    .select('id')
    .single();
  if (error || !data) throw new Error(`education create failed: ${error?.message ?? 'no row'}`);
  await syncTechnologies(
    client,
    'education_technologies',
    'education_id',
    data.id,
    input.technologyIds
  );
}

export async function updateEducation(
  client: SupabaseServerClient,
  id: string,
  input: EducationInput
): Promise<void> {
  const { error } = await client.from('education').update(educationRow(input)).eq('id', id);
  if (error) throw new Error(`education update failed: ${error.message}`);
  await syncTechnologies(client, 'education_technologies', 'education_id', id, input.technologyIds);
}

export async function deleteEducation(client: SupabaseServerClient, id: string): Promise<void> {
  const { error } = await client.from('education').delete().eq('id', id);
  if (error) throw new Error(`education delete failed: ${error.message}`);
}

function companyRow(input: CompanyInput) {
  return {
    name: input.name,
    logo_url: input.logoUrl,
    meta_line: input.metaLine,
    sort_order: input.sortOrder,
  };
}

export async function createCompany(
  client: SupabaseServerClient,
  input: CompanyInput
): Promise<void> {
  const { error } = await client.from('companies').insert(companyRow(input));
  if (error) throw new Error(`company create failed: ${error.message}`);
}

export async function updateCompany(
  client: SupabaseServerClient,
  id: string,
  input: CompanyInput
): Promise<void> {
  const { error } = await client.from('companies').update(companyRow(input)).eq('id', id);
  if (error) throw new Error(`company update failed: ${error.message}`);
}

export async function deleteCompany(client: SupabaseServerClient, id: string): Promise<void> {
  const { error } = await client.from('companies').delete().eq('id', id);
  if (error) throw new Error(`company delete failed: ${error.message}`);
}

function roleRow(input: RoleInput) {
  return {
    company_id: input.companyId,
    title: input.title,
    sector: input.sector,
    mode: input.mode,
    mode_key: input.modeKey,
    start_date: input.startDate,
    end_date: input.endDate,
    description: input.description,
    bullets: input.bullets,
    sort_order: input.sortOrder,
  };
}

export async function createRole(client: SupabaseServerClient, input: RoleInput): Promise<void> {
  const { data, error } = await client.from('roles').insert(roleRow(input)).select('id').single();
  if (error || !data) throw new Error(`role create failed: ${error?.message ?? 'no row'}`);
  await syncTechnologies(client, 'role_technologies', 'role_id', data.id, input.technologyIds);
}

export async function updateRole(
  client: SupabaseServerClient,
  id: string,
  input: RoleInput
): Promise<void> {
  const { error } = await client.from('roles').update(roleRow(input)).eq('id', id);
  if (error) throw new Error(`role update failed: ${error.message}`);
  await syncTechnologies(client, 'role_technologies', 'role_id', id, input.technologyIds);
}

export async function deleteRole(client: SupabaseServerClient, id: string): Promise<void> {
  const { error } = await client.from('roles').delete().eq('id', id);
  if (error) throw new Error(`role delete failed: ${error.message}`);
}

function projectRow(input: ProjectInput) {
  return {
    name: input.name,
    description: input.description,
    image_url: input.imageUrl,
    live_url: input.liveUrl,
    code_url: input.codeUrl,
    sort_order: input.sortOrder,
  };
}

export async function createProject(
  client: SupabaseServerClient,
  input: ProjectInput
): Promise<void> {
  const { data, error } = await client
    .from('projects')
    .insert(projectRow(input))
    .select('id')
    .single();
  if (error || !data) throw new Error(`project create failed: ${error?.message ?? 'no row'}`);
  await syncTechnologies(
    client,
    'project_technologies',
    'project_id',
    data.id,
    input.technologyIds
  );
}

export async function updateProject(
  client: SupabaseServerClient,
  id: string,
  input: ProjectInput
): Promise<void> {
  const { error } = await client.from('projects').update(projectRow(input)).eq('id', id);
  if (error) throw new Error(`project update failed: ${error.message}`);
  await syncTechnologies(client, 'project_technologies', 'project_id', id, input.technologyIds);
}

export async function deleteProject(client: SupabaseServerClient, id: string): Promise<void> {
  const { error } = await client.from('projects').delete().eq('id', id);
  if (error) throw new Error(`project delete failed: ${error.message}`);
}

export async function updateProfile(
  client: SupabaseServerClient,
  input: ProfileInput
): Promise<void> {
  const { data: existing, error: selectError } = await client
    .from('profile')
    .select('id')
    .limit(1)
    .single();
  if (selectError || !existing) {
    throw new Error(`profile not found: ${selectError?.message ?? 'no row'}`);
  }

  const { error } = await client
    .from('profile')
    .update({
      full_name: input.fullName,
      short_name: input.shortName,
      role: input.role,
      lead: input.lead,
      status_label: input.statusLabel,
      is_open_to_work: input.isOpenToWork,
      hero_badges: input.heroBadges,
      experience_start_date: input.experienceStartDate,
      avatar_url: input.avatarUrl,
      photo_url: input.photoUrl,
      email: input.email,
      linkedin_url: input.linkedinUrl,
      github_url: input.githubUrl,
      contact_title: input.contactTitle,
      contact_lead: input.contactLead,
      meta_title: input.metaTitle,
      meta_description: input.metaDescription,
    })
    .eq('id', existing.id);

  if (error) throw new Error(`profile update failed: ${error.message}`);
}
