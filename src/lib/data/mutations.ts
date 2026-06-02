import type { ProfileInput, StackGroupInput, TechnologyInput } from '@/lib/admin/schemas';
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
