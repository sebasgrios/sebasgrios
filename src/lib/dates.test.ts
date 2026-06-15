import { describe, expect, it } from 'vitest';
import { formatDuration, formatRange, monthSpan, yearsOfExperience } from './dates';

const units = { year: 'yr', years: 'yrs', month: 'mo', months: 'mos' };

describe('yearsOfExperience', () => {
  it('computes whole years from the career start', () => {
    // careerStart is 2022-07-18.
    expect(yearsOfExperience(new Date('2025-08-01'))).toBe(3);
  });

  it('never returns less than 1', () => {
    expect(yearsOfExperience(new Date('2022-07-19'))).toBe(1);
  });
});

describe('monthSpan', () => {
  it('counts months inclusively', () => {
    expect(monthSpan('2022-07', '2023-08')).toBe(14);
  });

  it('treats a null end as ongoing', () => {
    expect(monthSpan('2025-01', null, new Date('2025-03-15'))).toBe(3);
  });
});

describe('formatDuration', () => {
  it('formats years and months with plural labels', () => {
    expect(formatDuration('2022-07', '2023-08', units)).toBe('1 yr 2 mos');
  });

  it('uses singular labels for a single unit', () => {
    // 2022-07 → 2023-07 is 13 inclusive months → 1 yr 1 mo.
    expect(formatDuration('2022-07', '2023-07', units)).toBe('1 yr 1 mo');
  });

  it('omits a zero component', () => {
    expect(formatDuration('2022-01', '2022-12', units)).toBe('1 yr');
  });
});

describe('formatRange', () => {
  it('formats a closed range', () => {
    expect(formatRange('2022-07', '2023-08', 'Present')).toBe('2022 — 2023');
  });

  it('uses the present label for an open range', () => {
    expect(formatRange('2025-01', null, 'Present')).toBe('2025 — Present');
  });
});
