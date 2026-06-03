import { createSupabaseServerClient } from '@/lib/auth/supabaseServer';
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const code = context.url.searchParams.get('code');
  if (!code) return context.redirect('/admin/login?error=missing_code');
  const supabase = createSupabaseServerClient(context);
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return context.redirect('/admin/login?error=exchange_failed');
  return context.redirect('/admin');
};
