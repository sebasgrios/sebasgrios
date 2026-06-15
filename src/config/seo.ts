import type { Locale } from './site';

interface SeoEntry {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string[];
  ogLocale: string;
}

/**
 * Per-locale SEO metadata for the home page. Keywords target local (Málaga),
 * national (Spain) and international intent.
 */
export const seo: Record<Locale, SeoEntry> = {
  es: {
    title: 'Sebastián González Ríos — IA-Driven Engineer | SebasGRios',
    description:
      'Portfolio de Sebastián González Ríos (SebasGRios), IA-Driven Engineer en Málaga, España. Construyo software escalable con flujos de trabajo impulsados por IA. React, TypeScript, Astro y Cloudflare.',
    ogTitle: 'Sebastián González Ríos — IA-Driven Engineer',
    ogDescription: 'Construyo software escalable con flujos de trabajo impulsados por IA.',
    keywords: [
      'ingeniero software málaga',
      'desarrollador software málaga',
      'desarrollador react españa',
      'frontend engineer spain',
      'software engineer spain',
      'ai driven engineer',
    ],
    ogLocale: 'es_ES',
  },
  en: {
    title: 'Sebastián González Ríos — AI-Driven Engineer | SebasGRios',
    description:
      'Portfolio of Sebastián González Ríos (SebasGRios), AI-Driven Engineer based in Málaga, Spain. Building scalable software with AI-driven workflows. React, TypeScript, Astro and Cloudflare.',
    ogTitle: 'Sebastián González Ríos — AI-Driven Engineer',
    ogDescription: 'Building scalable software with AI-driven workflows.',
    keywords: [
      'software engineer málaga',
      'react developer spain',
      'frontend engineer spain',
      'software engineer spain',
      'ai driven engineer',
      'ai engineer spain',
    ],
    ogLocale: 'en_US',
  },
};
