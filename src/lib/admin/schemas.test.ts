import { describe, expect, it } from 'vitest';
import { profileInputSchema } from './schemas';

const valid = {
  fullName: 'Sebastián González Ríos',
  shortName: 'Sebas',
  role: { es: 'Ingeniero', en: 'Engineer' },
  lead: { es: 'Lead es', en: 'Lead en' },
  statusLabel: { es: 'Abierto', en: 'Open' },
  isOpenToWork: true,
  heroBadges: [{ es: 'Uno', en: 'One' }],
  experienceStartDate: '2021-09-01',
  avatarUrl: '',
  photoUrl: 'https://example.com/p.webp',
  email: 'contact@sebasgrios.es',
  linkedinUrl: '',
  githubUrl: 'https://github.com/sebasgrios',
  contactTitle: { es: 'Hola', en: 'Hi' },
  contactLead: { es: 'Lead', en: 'Lead' },
  metaTitle: { es: 'T', en: 'T' },
  metaDescription: { es: 'D', en: 'D' },
};

describe('profileInputSchema', () => {
  it('accepts a valid payload and coerces empty urls to null', () => {
    const result = profileInputSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.avatarUrl).toBeNull();
      expect(result.data.linkedinUrl).toBeNull();
      expect(result.data.photoUrl).toBe('https://example.com/p.webp');
    }
  });

  it('rejects a missing en translation', () => {
    const bad = { ...valid, role: { es: 'Ingeniero', en: '' } };
    expect(profileInputSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects an invalid email', () => {
    expect(profileInputSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false);
  });

  it('rejects a malformed date', () => {
    expect(
      profileInputSchema.safeParse({ ...valid, experienceStartDate: '01/09/2021' }).success
    ).toBe(false);
  });

  it('rejects a non-url photo', () => {
    expect(profileInputSchema.safeParse({ ...valid, photoUrl: 'not-a-url' }).success).toBe(false);
  });
});
