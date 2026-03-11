import type { TechnologyId } from '@/types/content';

export const TECHNOLOGY_LABELS = {
  astro: 'Astro',
  cloudflare: 'Cloudflare',
  mysql: 'MySQL',
  nextjs: 'Next.js',
  redux: 'Redux',
  tailwindcss: 'TailwindCSS',
  typescript: 'TypeScript',
  wordpress: 'WordPress'
} satisfies Record<TechnologyId, string>;
