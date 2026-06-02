import { setFlash } from '@/lib/admin/flash';
import { readLocalized, readLocalizedList, readString, readStringList } from '@/lib/admin/forms';
import { educationInputSchema } from '@/lib/admin/schemas';
import { createSupabaseServerClient } from '@/lib/auth/supabaseServer';
import { createEducation, deleteEducation, updateEducation } from '@/lib/data/mutations';
import type { APIRoute } from 'astro';

export const prerender = false;

const REDIRECT = '/admin/education';

export const POST: APIRoute = async (context) => {
  if (!context.locals.isAdmin) return new Response('Forbidden', { status: 403 });

  const form = await context.request.formData();
  const action = readString(form, '_action');
  const id = readString(form, 'id');
  const client = createSupabaseServerClient(context);

  try {
    if (action === 'delete') {
      if (!id) {
        setFlash(context.cookies, 'invalid');
        return context.redirect(REDIRECT);
      }
      await deleteEducation(client, id);
    } else {
      const parsed = educationInputSchema.safeParse({
        title: readLocalized(form, 'title'),
        school: readString(form, 'school'),
        startDate: readString(form, 'startDate'),
        endDate: readString(form, 'endDate'),
        description: readLocalized(form, 'description'),
        bullets: readLocalizedList(form, 'bullets', 12),
        sortOrder: readString(form, 'sortOrder'),
        technologyIds: readStringList(form, 'technologyIds'),
      });
      if (!parsed.success) {
        setFlash(context.cookies, 'invalid');
        return context.redirect(REDIRECT);
      }
      if (action === 'update') {
        if (!id) {
          setFlash(context.cookies, 'invalid');
          return context.redirect(REDIRECT);
        }
        await updateEducation(client, id, parsed.data);
      } else {
        await createEducation(client, parsed.data);
      }
    }
  } catch {
    setFlash(context.cookies, 'error');
    return context.redirect(REDIRECT);
  }

  setFlash(context.cookies, 'ok');
  return context.redirect(REDIRECT);
};
