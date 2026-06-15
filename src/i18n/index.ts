import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/config/site';
import en from './en.json';
import es from './es.json';

const dictionaries = { es, en } as const;

export type UIKey = keyof typeof es;

/** A bilingual content field, as stored in content collections. */
export type Localized<T = string> = { es: T; en: T };

/** Returns a translator bound to a locale. Falls back to the key if missing. */
export function useTranslations(locale: Locale) {
  const dict = dictionaries[locale];
  return (key: UIKey): string => dict[key] ?? key;
}

/** Extracts a localized field value for the given locale. */
export function pickLocalized<T>(field: Localized<T>, locale: Locale): T {
  return field[locale];
}

/** Type guard for a supported locale. */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Reads the active locale from a URL pathname (/es/…, /en/…). */
export function getLocaleFromUrl(url: URL): Locale {
  const [, segment] = url.pathname.split('/');
  return segment && isLocale(segment) ? segment : DEFAULT_LOCALE;
}

/** The opposite locale — used for the alternate-language link. */
export function otherLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es';
}
