import { describe, expect, it } from 'vitest';
import { pickLocale, pickLocaleArray } from './i18n';

describe('pickLocale', () => {
  it('returns requested locale', () => {
    expect(pickLocale({ es: 'hola', en: 'hi' }, 'en')).toBe('hi');
  });

  it('falls back to es when en is empty', () => {
    expect(pickLocale({ es: 'hola', en: '' }, 'en')).toBe('hola');
  });

  it('returns empty string for null input', () => {
    expect(pickLocale(null, 'en')).toBe('');
  });

  it('returns empty string for undefined input', () => {
    expect(pickLocale(undefined, 'en')).toBe('');
  });
});

describe('pickLocaleArray', () => {
  it('maps each entry to the requested locale', () => {
    expect(
      pickLocaleArray(
        [
          { es: 'uno', en: 'one' },
          { es: 'dos', en: 'two' },
        ],
        'en'
      )
    ).toEqual(['one', 'two']);
  });

  it('drops empty entries after fallback', () => {
    expect(
      pickLocaleArray(
        [
          { es: '', en: '' },
          { es: 'dos', en: '' },
        ],
        'en'
      )
    ).toEqual(['dos']);
  });

  it('returns empty array for null', () => {
    expect(pickLocaleArray(null, 'en')).toEqual([]);
  });
});
