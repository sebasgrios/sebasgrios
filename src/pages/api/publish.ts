import { setFlash } from '@/lib/admin/flash';
import { createSupabaseServerClient } from '@/lib/auth/supabaseServer';
import { logAudit } from '@/lib/data/audit';
import type { APIRoute } from 'astro';

export const prerender = false;

const REDIRECT = '/admin/publish';

export const POST: APIRoute = async (context) => {
  if (!context.locals.isAdmin) return new Response('Forbidden', { status: 403 });

  const hookUrl =
    context.locals.runtime?.env?.CF_DEPLOY_HOOK_URL ?? import.meta.env.CF_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    setFlash(context.cookies, 'error');
    return context.redirect(REDIRECT);
  }

  try {
    const response = await fetch(hookUrl, { method: 'POST' });
    if (!response.ok) throw new Error(`deploy hook responded ${response.status}`);
  } catch (error) {
    console.error('[admin] publish deploy hook failed:', error);
    setFlash(context.cookies, 'error');
    return context.redirect(REDIRECT);
  }

  await logAudit(createSupabaseServerClient(context), 'publish', 'publish', null);
  setFlash(context.cookies, 'ok');
  return context.redirect(REDIRECT);
};
