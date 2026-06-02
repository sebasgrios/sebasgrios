import type { ProfileInput } from '@/lib/admin/schemas';
import type { SupabaseServerClient } from '@/lib/auth/supabaseServer';

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
