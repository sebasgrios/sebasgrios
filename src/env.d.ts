/// <reference path="../.astro/types.d.ts" />

declare module '*.wasm' {
  const wasm: WebAssembly.Module;
  export default wasm;
}

interface ImportMetaEnv {
  readonly SUPABASE_SERVICE_ROLE_KEY?: string;
  readonly SESSION_SECRET?: string;
  readonly CF_DEPLOY_HOOK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    locale: 'es' | 'en';
    user?: { id: string; email: string | null } | null;
    isAdmin?: boolean;
  }
}

interface Env {
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SESSION_SECRET?: string;
  CF_DEPLOY_HOOK_URL?: string;
}
