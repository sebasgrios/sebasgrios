import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sebasgrios.es',
  output: 'static',
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
        "frame-src 'none'",
        "img-src 'self' data: https://*.supabase.co",
        "font-src 'self' data:",
        "connect-src 'self' https://cloudflareinsights.com",
      ],
      scriptDirective: {
        resources: ["'self'", 'https://static.cloudflareinsights.com'],
      },
      styleDirective: {
        resources: ["'self'"],
      },
    },
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES', en: 'en-US' },
      },
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
  },
});
