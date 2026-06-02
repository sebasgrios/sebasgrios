import type { ProfileInput, TechnologyInput } from '@/lib/admin/schemas';
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
