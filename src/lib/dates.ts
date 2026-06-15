import { site } from '@/config/site';

/** Whole years of experience since the career start date. Minimum 1. */
export function yearsOfExperience(now: Date = new Date()): number {
  const start = new Date(site.careerStart);
  const diff = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(1, Math.floor(diff));
}

/** Inclusive month count between two "YYYY-MM" marks (end null = now). */
export function monthSpan(start: string, end: string | null, now: Date = new Date()): number {
  const s = new Date(`${start}-01`);
  const e = end ? new Date(`${end}-01`) : now;
  const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  return Math.max(1, months + 1);
}

/** Human duration, e.g. "1 año 2 meses", using localized, pluralized labels. */
export function formatDuration(
  start: string,
  end: string | null,
  units: { year: string; years: string; month: string; months: string },
  now: Date = new Date(),
): string {
  const months = monthSpan(start, end, now);
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} ${y === 1 ? units.year : units.years}`);
  if (m) parts.push(`${m} ${m === 1 ? units.month : units.months}`);
  return parts.join(' ');
}

/** Year range, e.g. "2022 — 2023" or "2025 — Present". */
export function formatRange(start: string, end: string | null, present: string): string {
  const year = (mark: string) => mark.split('-')[0];
  return `${year(start)} — ${end ? year(end) : present}`;
}
