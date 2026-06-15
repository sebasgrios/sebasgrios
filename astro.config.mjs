import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

const SITE = 'https://sebasgrios.es';

// 100% static site served by Cloudflare Pages — no adapter, no SSR.
export default defineConfig({
  site: SITE,
  output: 'static',
  prefetch: { defaultStrategy: 'hover' },
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      // both locales live under a prefix (/es, /en); `/` is handled by a
      // language-detecting landing page (see Phase 8).
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  // hreflang/alternate links live in <head> (the authoritative signal), so the
  // sitemap just lists the indexable locale homes and drops the `/` redirect.
  integrations: [
    sitemap({
      filter: (page) => page !== `${SITE}/`,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
