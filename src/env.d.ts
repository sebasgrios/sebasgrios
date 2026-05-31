/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly SESSION_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    locale: 'es' | 'en';
  }
}

interface Env {
  PUBLIC_SITE_URL: string;
  PUBLIC_SUPABASE_URL: string;
  PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SESSION_SECRET: string;
}
