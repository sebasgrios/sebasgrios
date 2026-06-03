import { SUPABASE } from '@/config/supabase';
import type { Database } from '@/lib/data/database.types';
import { type CookieMethodsServer, createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';

export type SupabaseServerClient = SupabaseClient<Database>;

interface RequestContext {
  request: Request;
  cookies: AstroCookies;
}

function parseCookieHeader(header: string | null): { name: string; value: string }[] {
  if (!header) return [];
  return header
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const index = part.indexOf('=');
      const name = index === -1 ? part : part.slice(0, index);
      const value = index === -1 ? '' : part.slice(index + 1);
      return { name, value: decodeURIComponent(value) };
    });
}

export function createSupabaseServerClient({
  request,
  cookies,
}: RequestContext): SupabaseServerClient {
  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return parseCookieHeader(request.headers.get('cookie'));
    },
    setAll(cookiesToSet) {
      for (const { name, value, options } of cookiesToSet) {
        cookies.set(name, value, options as Parameters<typeof cookies.set>[2]);
      }
    },
  };

  return createServerClient<Database>(SUPABASE.url, SUPABASE.anonKey, { cookies: cookieMethods });
}
