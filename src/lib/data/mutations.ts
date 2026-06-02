import type {
  CompanyInput,
  EducationInput,
  ProfileInput,
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

async function syncStackGroupTechnologies(
  client: SupabaseServerClient,
  groupId: string,
  technologyIds: string[]
): Promise<void> {
  const { error: deleteError } = await client
    .from('stack_group_technologies')
    .delete()
    .eq('stack_group_id', groupId);
  if (deleteError) throw new Error(`stack technologies clear failed: ${deleteError.message}`);

  if (technologyIds.length === 0) return;
  const rows = technologyIds.map((technology_id, index) => ({
    stack_group_id: groupId,
    technology_id,
    sort_order: index,
  }));
  const { error: insertError } = await client.from('stack_group_technologies').insert(rows);
  if (insertError) throw new Error(`stack technologies set failed: ${insertError.message}`);
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
  await syncStackGroupTechnologies(client, data.id, input.technologyIds);
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
  await syncStackGroupTechnologies(client, id, input.technologyIds);
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

async function syncEducationTechnologies(
  client: SupabaseServerClient,
  educationId: string,
  technologyIds: string[]
): Promise<void> {
  const { error: deleteError } = await client
    .from('education_technologies')
    .delete()
    .eq('education_id', educationId);
  if (deleteError) throw new Error(`education technologies clear failed: ${deleteError.message}`);

  if (technologyIds.length === 0) return;
  const rows = technologyIds.map((technology_id, index) => ({
    education_id: educationId,
    technology_id,
    sort_order: index,
  }));
  const { error: insertError } = await client.from('education_technologies').insert(rows);
  if (insertError) throw new Error(`education technologies set failed: ${insertError.message}`);
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
  await syncEducationTechnologies(client, data.id, input.technologyIds);
}

export async function updateEducation(
  client: SupabaseServerClient,
  id: string,
  input: EducationInput
): Promise<void> {
  const { error } = await client.from('education').update(educationRow(input)).eq('id', id);
  if (error) throw new Error(`education update failed: ${error.message}`);
  await syncEducationTechnologies(client, id, input.technologyIds);
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

async function syncRoleTechnologies(
  client: SupabaseServerClient,
  roleId: string,
  technologyIds: string[]
): Promise<void> {
  const { error: deleteError } = await client
    .from('role_technologies')
    .delete()
    .eq('role_id', roleId);
  if (deleteError) throw new Error(`role technologies clear failed: ${deleteError.message}`);

  if (technologyIds.length === 0) return;
  const rows = technologyIds.map((technology_id, index) => ({
    role_id: roleId,
    technology_id,
    sort_order: index,
  }));
  const { error: insertError } = await client.from('role_technologies').insert(rows);
  if (insertError) throw new Error(`role technologies set failed: ${insertError.message}`);
}

export async function createRole(client: SupabaseServerClient, input: RoleInput): Promise<void> {
  const { data, error } = await client.from('roles').insert(roleRow(input)).select('id').single();
  if (error || !data) throw new Error(`role create failed: ${error?.message ?? 'no row'}`);
  await syncRoleTechnologies(client, data.id, input.technologyIds);
}

export async function updateRole(
  client: SupabaseServerClient,
  id: string,
  input: RoleInput
): Promise<void> {
  const { error } = await client.from('roles').update(roleRow(input)).eq('id', id);
  if (error) throw new Error(`role update failed: ${error.message}`);
  await syncRoleTechnologies(client, id, input.technologyIds);
}

export async function deleteRole(client: SupabaseServerClient, id: string): Promise<void> {
  const { error } = await client.from('roles').delete().eq('id', id);
  if (error) throw new Error(`role delete failed: ${error.message}`);
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
