import { setFlash } from '@/lib/admin/flash';
import { readString } from '@/lib/admin/forms';
import { technologyInputSchema } from '@/lib/admin/schemas';
import { createSupabaseServerClient } from '@/lib/auth/supabaseServer';
import { createTechnology, deleteTechnology, updateTechnology } from '@/lib/data/mutations';
import type { APIRoute } from 'astro';

export const prerender = false;

const REDIRECT = '/admin/technologies';

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
      await deleteTechnology(client, id);
    } else {
      const parsed = technologyInputSchema.safeParse({
        key: readString(form, 'key'),
        label: readString(form, 'label'),
        iconKey: readString(form, 'iconKey'),
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
        await updateTechnology(client, id, parsed.data);
      } else {
        await createTechnology(client, parsed.data);
      }
    }
  } catch {
    setFlash(context.cookies, 'error');
    return context.redirect(REDIRECT);
  }

  setFlash(context.cookies, 'ok');
  return context.redirect(REDIRECT);
};
