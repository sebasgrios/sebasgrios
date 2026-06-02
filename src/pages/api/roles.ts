import { setFlash } from '@/lib/admin/flash';
import { readLocalized, readLocalizedList, readString, readStringList } from '@/lib/admin/forms';
import { roleInputSchema } from '@/lib/admin/schemas';
import { createSupabaseServerClient } from '@/lib/auth/supabaseServer';
import { createRole, deleteRole, updateRole } from '@/lib/data/mutations';
import type { APIRoute } from 'astro';

export const prerender = false;

const REDIRECT = '/admin/companies';

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
      await deleteRole(client, id);
    } else {
      const parsed = roleInputSchema.safeParse({
        companyId: readString(form, 'companyId'),
        title: readLocalized(form, 'title'),
        sector: readLocalized(form, 'sector'),
        mode: readLocalized(form, 'mode'),
        modeKey: readString(form, 'modeKey'),
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
        await updateRole(client, id, parsed.data);
      } else {
        await createRole(client, parsed.data);
      }
    }
  } catch {
    setFlash(context.cookies, 'error');
    return context.redirect(REDIRECT);
  }

  setFlash(context.cookies, 'ok');
  return context.redirect(REDIRECT);
};
