import { describe, expect, it } from 'vitest';
import { formatDateRange, formatMonthYear, yearsBetween } from './dates';

describe('formatMonthYear', () => {
  it('formats ISO date in spanish', () => {
    const out = formatMonthYear('2025-01-15', 'es');
    expect(out).toMatch(/ene/i);
    expect(out).toContain('2025');
  });
  it('formats ISO date in english', () => {
    const out = formatMonthYear('2025-01-15', 'en');
    expect(out).toMatch(/jan/i);
    expect(out).toContain('2025');
  });
  it('returns empty string for invalid date', () => {
    expect(formatMonthYear('not-a-date', 'es')).toBe('');
  });
});

describe('formatDateRange', () => {
  it('uses "actualidad" for null end date in es', () => {
    expect(formatDateRange('2024-01-01', null, 'es')).toContain('actualidad');
  });
  it('uses "present" for null end date in en', () => {
    expect(formatDateRange('2024-01-01', null, 'en')).toContain('present');
  });
  it('joins start and end with em dash', () => {
    const out = formatDateRange('2022-07-01', '2025-01-01', 'es');
    expect(out).toContain('—');
  });
});

describe('yearsBetween', () => {
  it('returns 3 for a 3-year span', () => {
    expect(yearsBetween('2022-01-01', new Date('2025-06-01'))).toBe(3);
  });
  it('returns 0 for invalid input', () => {
    expect(yearsBetween('not-a-date')).toBe(0);
  });
  it('returns negative value for future start date (no clamping)', () => {
    expect(yearsBetween('2099-01-01', new Date('2025-01-01'))).toBeLessThan(0);
  });
});
