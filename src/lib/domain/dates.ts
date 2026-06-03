import type { Locale } from '@/config/i18n';

export function formatMonthYear(isoDate: string, locale: Locale): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateRange(startIso: string, endIso: string | null, locale: Locale): string {
  const start = formatMonthYear(startIso, locale);
  const presentLabel = locale === 'es' ? 'actualidad' : 'present';
  const end = endIso ? formatMonthYear(endIso, locale) : presentLabel;
  return `${start} — ${end}`;
}

export function yearsBetween(startIso: string, endIso: string | Date = new Date()): number {
  const start = new Date(startIso);
  const end = endIso instanceof Date ? endIso : new Date(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const ms = end.getTime() - start.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24 * 365.25));
}
