import { DEFAULT_LOCALE, type Locale, type Localized } from '@/config/i18n';

export function pickLocale(
  value: Localized<string> | undefined | null,
  locale: Locale,
  fallback: Locale = DEFAULT_LOCALE
): string {
  if (!value) return '';
  return value[locale] || value[fallback] || '';
}

export function pickLocaleArray(
  value: Localized<string>[] | undefined | null,
  locale: Locale,
  fallback: Locale = DEFAULT_LOCALE
): string[] {
  if (!value) return [];
  return value.map((entry) => pickLocale(entry, locale, fallback)).filter(Boolean);
}
