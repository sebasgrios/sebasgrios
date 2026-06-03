import { describe, expect, it } from 'vitest';
import { readBool, readLocalized, readLocalizedList, readString } from './forms';

function fd(entries: Record<string, string>): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(entries)) form.append(key, value);
  return form;
}

describe('readString', () => {
  it('returns the value or empty string', () => {
    expect(readString(fd({ a: 'x' }), 'a')).toBe('x');
    expect(readString(fd({}), 'missing')).toBe('');
  });
});

describe('readLocalized', () => {
  it('reads es and en from dotted keys', () => {
    expect(readLocalized(fd({ 'role.es': 'Ingeniero', 'role.en': 'Engineer' }), 'role')).toEqual({
      es: 'Ingeniero',
      en: 'Engineer',
    });
  });
});

describe('readBool', () => {
  it('is true for on/true/1 and false otherwise', () => {
    expect(readBool(fd({ open: 'on' }), 'open')).toBe(true);
    expect(readBool(fd({ open: 'true' }), 'open')).toBe(true);
    expect(readBool(fd({ open: '1' }), 'open')).toBe(true);
    expect(readBool(fd({ open: 'off' }), 'open')).toBe(false);
    expect(readBool(fd({}), 'open')).toBe(false);
  });
});

describe('readLocalizedList', () => {
  it('collects indexed entries and drops empty ones', () => {
    const form = fd({
      'badges.0.es': 'Uno',
      'badges.0.en': 'One',
      'badges.1.es': '',
      'badges.1.en': '',
      'badges.2.es': 'Tres',
      'badges.2.en': 'Three',
    });
    expect(readLocalizedList(form, 'badges')).toEqual([
      { es: 'Uno', en: 'One' },
      { es: 'Tres', en: 'Three' },
    ]);
  });
});
