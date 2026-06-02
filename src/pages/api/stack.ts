import { setFlash } from '@/lib/admin/flash';
import { readLocalized, readString, readStringList } from '@/lib/admin/forms';
import { stackGroupInputSchema } from '@/lib/admin/schemas';
import { createSupabaseServerClient } from '@/lib/auth/supabaseServer';
import { createStackGroup, deleteStackGroup, updateStackGroup } from '@/lib/data/mutations';
import type { APIRoute } from 'astro';

export const prerender = false;

const REDIRECT = '/admin/stack';

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
      await deleteStackGroup(client, id);
    } else {
      const parsed = stackGroupInputSchema.safeParse({
        label: readLocalized(form, 'label'),
        iconKey: readString(form, 'iconKey'),
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
        await updateStackGroup(client, id, parsed.data);
      } else {
        await createStackGroup(client, parsed.data);
      }
    }
  } catch {
    setFlash(context.cookies, 'error');
    return context.redirect(REDIRECT);
  }

  setFlash(context.cookies, 'ok');
  return context.redirect(REDIRECT);
};
