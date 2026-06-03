import type { SupabaseServerClient } from '@/lib/auth/supabaseServer';
import type { User } from '@supabase/supabase-js';

export async function getAuthUser(supabase: SupabaseServerClient): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getIsAdmin(supabase: SupabaseServerClient): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_admin');
  if (error) return false;
  return data === true;
}
