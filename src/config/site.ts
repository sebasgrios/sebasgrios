export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'es';

export const site = {
  name: 'SebasGRios',
  domain: 'sebasgrios.es',
  url: 'https://sebasgrios.es',
  author: 'Sebastián González Ríos',
  location: { locality: 'Málaga', country: 'ES' },
  defaultLocale: DEFAULT_LOCALE,
  locales: LOCALES,
  // Years of experience are computed from this date — never hardcode them.
  careerStart: '2022-07-18',
} as const;
