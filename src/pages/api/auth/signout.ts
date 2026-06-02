import { createSupabaseServerClient } from '@/lib/auth/supabaseServer';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const supabase = createSupabaseServerClient(context);
  await supabase.auth.signOut();
  return context.redirect('/admin/login');
};
