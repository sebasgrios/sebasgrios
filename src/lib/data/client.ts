import type { Database } from '@/lib/data/database.types';
import { type SupabaseClient, createClient } from '@supabase/supabase-js';

type AppSupabaseClient = SupabaseClient<Database>;

let cached: AppSupabaseClient | null = null;

export function createServerClient(env: {
  PUBLIC_SUPABASE_URL: string;
  PUBLIC_SUPABASE_ANON_KEY: string;
}): AppSupabaseClient {
  if (cached) return cached;
  cached = createClient<Database>(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'public' },
    global: { headers: { 'x-portfolio-version': 'v3' } },
  });
  return cached;
}

export function getServerClient(): AppSupabaseClient {
  const env = {
    PUBLIC_SUPABASE_URL: import.meta.env.PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  };
  if (!env.PUBLIC_SUPABASE_URL || !env.PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase env vars: PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY');
  }
  return createServerClient(env);
}

export type { AppSupabaseClient };
