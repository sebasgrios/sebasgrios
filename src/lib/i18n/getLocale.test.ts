import { describe, expect, it } from 'vitest';
import { getLocaleFromPath } from './getLocale';

describe('getLocaleFromPath', () => {
  it('returns es for root path', () => {
    expect(getLocaleFromPath('/')).toBe('es');
  });
  it('returns es for unknown locale segment', () => {
    expect(getLocaleFromPath('/about')).toBe('es');
  });
  it('returns en for /en path', () => {
    expect(getLocaleFromPath('/en')).toBe('en');
    expect(getLocaleFromPath('/en/')).toBe('en');
    expect(getLocaleFromPath('/en/whatever')).toBe('en');
  });
  it('defaults to es when path has only slashes', () => {
    expect(getLocaleFromPath('//')).toBe('es');
  });
});
