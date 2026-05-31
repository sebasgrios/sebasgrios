import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sebasgrios.es',
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: 'compile',
  }),
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
      filter: (page) => !page.includes('/401') && !page.includes('/404') && !page.includes('/dev/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
  },
});
