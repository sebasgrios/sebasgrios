import { createSupabaseServerClient } from '@/lib/auth/supabaseServer';
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const supabase = createSupabaseServerClient(context);
  const redirectTo = new URL('/api/auth/callback', context.url.origin).toString();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
  if (error || !data?.url) {
    return context.redirect('/admin/login?error=oauth_init');
  }
  return context.redirect(data.url, 302);
};
