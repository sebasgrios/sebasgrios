import { defineMiddleware } from 'astro:middleware';
import { getAuthUser, getIsAdmin } from '@/lib/auth/session';
import { createSupabaseServerClient } from '@/lib/auth/supabaseServer';
import { getLocaleFromPath } from '@/lib/i18n/getLocale';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = new URL(context.request.url);
  context.locals.locale = getLocaleFromPath(pathname);

  const isAdminPage =
    (pathname === '/admin' || pathname.startsWith('/admin/')) && pathname !== '/admin/login';
  const isProtectedApi = pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/');

  if (isAdminPage || isProtectedApi) {
    const supabase = createSupabaseServerClient(context);
    const user = await getAuthUser(supabase);
    if (!user) {
      if (isProtectedApi) return new Response('Unauthorized', { status: 401 });
      return context.redirect('/admin/login');
    }

    const isAdmin = await getIsAdmin(supabase);
    context.locals.user = { id: user.id, email: user.email ?? null };
    context.locals.isAdmin = isAdmin;
    if (!isAdmin) {
      if (isProtectedApi) return new Response('Forbidden', { status: 403 });
      return context.redirect('/401');
    }
  }

  return next();
});
