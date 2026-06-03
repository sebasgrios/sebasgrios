import { describe, expect, it } from 'vitest';
import {
  companyInputSchema,
  educationInputSchema,
  profileInputSchema,
  projectInputSchema,
  roleInputSchema,
  stackGroupInputSchema,
  technologyInputSchema,
} from './schemas';

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

describe('technologyInputSchema', () => {
  const tech = { key: 'typescript', label: 'TypeScript', iconKey: '', sortOrder: '3' };

  it('accepts a valid technology, coerces order and empty icon to null', () => {
    const result = technologyInputSchema.safeParse(tech);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sortOrder).toBe(3);
      expect(result.data.iconKey).toBeNull();
    }
  });

  it('rejects a key with uppercase or spaces', () => {
    expect(technologyInputSchema.safeParse({ ...tech, key: 'Type Script' }).success).toBe(false);
  });

  it('rejects an empty label', () => {
    expect(technologyInputSchema.safeParse({ ...tech, label: '  ' }).success).toBe(false);
  });

  it('rejects a non-integer order', () => {
    expect(technologyInputSchema.safeParse({ ...tech, sortOrder: 'abc' }).success).toBe(false);
  });
});

describe('stackGroupInputSchema', () => {
  const group = {
    label: { es: 'Frontend', en: 'Frontend' },
    iconKey: 'code',
    sortOrder: '2',
    technologyIds: ['11111111-1111-1111-1111-111111111111'],
  };

  it('accepts a valid group', () => {
    const result = stackGroupInputSchema.safeParse(group);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.technologyIds).toHaveLength(1);
  });

  it('rejects an unknown icon key', () => {
    expect(stackGroupInputSchema.safeParse({ ...group, iconKey: 'rocket' }).success).toBe(false);
  });

  it('rejects a non-uuid technology id', () => {
    expect(stackGroupInputSchema.safeParse({ ...group, technologyIds: ['nope'] }).success).toBe(
      false
    );
  });

  it('accepts an empty technology selection', () => {
    expect(stackGroupInputSchema.safeParse({ ...group, technologyIds: [] }).success).toBe(true);
  });
});

describe('educationInputSchema', () => {
  const edu = {
    title: { es: 'DAW', en: 'DAW' },
    school: 'IES Campanillas',
    startDate: '2019-09-01',
    endDate: '',
    description: { es: 'desc', en: 'desc' },
    bullets: [{ es: 'a', en: 'a' }],
    sortOrder: '1',
    technologyIds: [],
  };

  it('accepts a valid entry and coerces empty endDate to null', () => {
    const result = educationInputSchema.safeParse(edu);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.endDate).toBeNull();
  });

  it('accepts a real endDate', () => {
    const result = educationInputSchema.safeParse({ ...edu, endDate: '2021-06-30' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.endDate).toBe('2021-06-30');
  });

  it('rejects a malformed startDate', () => {
    expect(educationInputSchema.safeParse({ ...edu, startDate: '2019' }).success).toBe(false);
  });

  it('rejects a bullet missing a translation', () => {
    expect(educationInputSchema.safeParse({ ...edu, bullets: [{ es: 'a', en: '' }] }).success).toBe(
      false
    );
  });
});

describe('companyInputSchema', () => {
  const company = {
    name: 'NTT DATA',
    logoUrl: '',
    metaLine: { es: 'Remoto', en: 'Remote' },
    sortOrder: '0',
  };

  it('accepts a valid company and empty logo becomes null', () => {
    const result = companyInputSchema.safeParse(company);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.logoUrl).toBeNull();
  });

  it('rejects an empty name', () => {
    expect(companyInputSchema.safeParse({ ...company, name: '' }).success).toBe(false);
  });
});

describe('roleInputSchema', () => {
  const role = {
    companyId: '11111111-1111-1111-1111-111111111111',
    title: { es: 'Ingeniero', en: 'Engineer' },
    sector: { es: 'Banca', en: 'Banking' },
    mode: { es: 'Remoto', en: 'Remote' },
    modeKey: 'remote',
    startDate: '2022-01-01',
    endDate: '',
    description: { es: 'desc', en: 'desc' },
    bullets: [],
    sortOrder: '0',
    technologyIds: [],
  };

  it('accepts a valid role', () => {
    expect(roleInputSchema.safeParse(role).success).toBe(true);
  });

  it('rejects an unknown modeKey', () => {
    expect(roleInputSchema.safeParse({ ...role, modeKey: 'space' }).success).toBe(false);
  });

  it('rejects a non-uuid companyId', () => {
    expect(roleInputSchema.safeParse({ ...role, companyId: 'x' }).success).toBe(false);
  });
});

describe('projectInputSchema', () => {
  const project = {
    name: 'BastianGR',
    description: { es: 'desc', en: 'desc' },
    imageUrl: 'https://example.com/i.webp',
    liveUrl: '',
    codeUrl: '',
    sortOrder: '0',
    technologyIds: ['11111111-1111-1111-1111-111111111111'],
  };

  it('accepts a valid project and empty urls become null', () => {
    const result = projectInputSchema.safeParse(project);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.liveUrl).toBeNull();
      expect(result.data.codeUrl).toBeNull();
      expect(result.data.imageUrl).toBe('https://example.com/i.webp');
    }
  });

  it('rejects an empty name', () => {
    expect(projectInputSchema.safeParse({ ...project, name: '' }).success).toBe(false);
  });
});
