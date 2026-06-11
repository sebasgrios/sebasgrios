import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE } from '@/config/supabase';
import type { Database } from '@/lib/data/database.types';

type AppSupabaseClient = SupabaseClient<Database>;

let cached: AppSupabaseClient | null = null;

export function getServerClient(): AppSupabaseClient {
  if (cached) return cached;
  cached = createClient<Database>(SUPABASE.url, SUPABASE.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'public' },
    global: { headers: { 'x-portfolio-version': 'v4' } },
  });
  return cached;
}

export type { AppSupabaseClient };
