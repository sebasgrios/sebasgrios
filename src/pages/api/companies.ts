import { setFlash } from '@/lib/admin/flash';
import { readLocalized, readString } from '@/lib/admin/forms';
import { companyInputSchema } from '@/lib/admin/schemas';
import { createSupabaseServerClient } from '@/lib/auth/supabaseServer';
import { createCompany, deleteCompany, updateCompany } from '@/lib/data/mutations';
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
      await deleteCompany(client, id);
    } else {
      const parsed = companyInputSchema.safeParse({
        name: readString(form, 'name'),
        logoUrl: readString(form, 'logoUrl'),
        metaLine: readLocalized(form, 'metaLine'),
        sortOrder: readString(form, 'sortOrder'),
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
        await updateCompany(client, id, parsed.data);
      } else {
        await createCompany(client, parsed.data);
      }
    }
  } catch {
    setFlash(context.cookies, 'error');
    return context.redirect(REDIRECT);
  }

  setFlash(context.cookies, 'ok');
  return context.redirect(REDIRECT);
};
