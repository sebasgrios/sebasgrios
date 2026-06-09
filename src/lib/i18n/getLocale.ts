import { DEFAULT_LOCALE, isLocale, type Locale } from '@/config/i18n';

export function getLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0];
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}
