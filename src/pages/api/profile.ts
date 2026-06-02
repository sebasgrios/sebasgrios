import { setFlash } from '@/lib/admin/flash';
import { readBool, readLocalized, readLocalizedList, readString } from '@/lib/admin/forms';
import { profileInputSchema } from '@/lib/admin/schemas';
import { createSupabaseServerClient } from '@/lib/auth/supabaseServer';
import { updateProfile } from '@/lib/data/mutations';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  if (!context.locals.isAdmin) return new Response('Forbidden', { status: 403 });

  const form = await context.request.formData();
  const parsed = profileInputSchema.safeParse({
    fullName: readString(form, 'fullName'),
    shortName: readString(form, 'shortName'),
    role: readLocalized(form, 'role'),
    lead: readLocalized(form, 'lead'),
    statusLabel: readLocalized(form, 'statusLabel'),
    isOpenToWork: readBool(form, 'isOpenToWork'),
    heroBadges: readLocalizedList(form, 'heroBadges'),
    experienceStartDate: readString(form, 'experienceStartDate'),
    avatarUrl: readString(form, 'avatarUrl'),
    photoUrl: readString(form, 'photoUrl'),
    email: readString(form, 'email'),
    linkedinUrl: readString(form, 'linkedinUrl'),
    githubUrl: readString(form, 'githubUrl'),
    contactTitle: readLocalized(form, 'contactTitle'),
    contactLead: readLocalized(form, 'contactLead'),
    metaTitle: readLocalized(form, 'metaTitle'),
    metaDescription: readLocalized(form, 'metaDescription'),
  });

  if (!parsed.success) {
    setFlash(context.cookies, 'invalid');
    return context.redirect('/admin/profile');
  }

  try {
    const supabase = createSupabaseServerClient(context);
    await updateProfile(supabase, parsed.data);
  } catch {
    setFlash(context.cookies, 'error');
    return context.redirect('/admin/profile');
  }

  setFlash(context.cookies, 'ok');
  return context.redirect('/admin/profile');
};
