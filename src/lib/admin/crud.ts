import { type FlashStatus, setFlash } from '@/lib/admin/flash';
import { readString } from '@/lib/admin/forms';
import { type SupabaseServerClient, createSupabaseServerClient } from '@/lib/auth/supabaseServer';
import { logAudit } from '@/lib/data/audit';
import type { APIContext, APIRoute } from 'astro';
import type { ZodTypeAny, z } from 'zod';

interface CrudConfig<Schema extends ZodTypeAny> {
  entity: string;
  redirect: string;
  schema: Schema;
  parse: (form: FormData) => unknown;
  create: (client: SupabaseServerClient, input: z.infer<Schema>) => Promise<void>;
  update: (client: SupabaseServerClient, id: string, input: z.infer<Schema>) => Promise<void>;
  remove: (client: SupabaseServerClient, id: string) => Promise<void>;
}

function flash(context: APIContext, redirect: string, status: FlashStatus): Response {
  setFlash(context.cookies, status);
  return context.redirect(redirect);
}

/**
 * Builds the `POST` handler for a list entity. Dispatches create/update/delete
 * from the hidden `_action` field, validates with Zod, mutates via the
 * authenticated client (RLS enforces admin), and sets the flash toast.
 */
export function createCrudRoute<Schema extends ZodTypeAny>(config: CrudConfig<Schema>): APIRoute {
  return async (context) => {
    if (!context.locals.isAdmin) return new Response('Forbidden', { status: 403 });

    const form = await context.request.formData();
    const action = readString(form, '_action');
    const id = readString(form, 'id');
    const client = createSupabaseServerClient(context);

    try {
      if (action === 'delete') {
        if (!id) return flash(context, config.redirect, 'invalid');
        await config.remove(client, id);
      } else {
        const parsed = config.schema.safeParse(config.parse(form));
        if (!parsed.success) return flash(context, config.redirect, 'invalid');
        if (action === 'update') {
          if (!id) return flash(context, config.redirect, 'invalid');
          await config.update(client, id, parsed.data);
        } else {
          await config.create(client, parsed.data);
        }
      }
    } catch (error) {
      console.error(`[admin] ${config.entity} ${action || 'create'} failed:`, error);
      return flash(context, config.redirect, 'error');
    }

    await logAudit(client, config.entity, action || 'create', id || null);
    return flash(context, config.redirect, 'ok');
  };
}
