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
    throw new Error(
      [
        'Supabase env vars are missing.',
        'Required: PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.',
        'Local dev: copy .env.local.example to .env.local and fill the values.',
        'Cloudflare Pages: add them under Settings → Environment variables (Production and Preview).',
        'See docs/12-deployment.md for the full list.',
      ].join(' ')
    );
  }
  return createServerClient(env);
}

export type { AppSupabaseClient };
