import { describe, expect, it } from 'vitest';
import { computeYearsOfExperience, countProjects, countUniqueSectors } from './stats';
import type { Company, Profile, Project } from './types';

const profile = {
  experienceStartDate: '2022-07-01',
} as unknown as Profile;

const companies: Company[] = [
  {
    id: 'c1',
    name: 'A',
    logoUrl: null,
    metaLine: { es: '', en: '' },
    roles: [
      {
        id: 'r1',
        companyId: 'c1',
        title: { es: '', en: '' },
        sector: { es: 'FinTech', en: 'FinTech' },
        mode: { es: '', en: '' },
        modeKey: 'remote',
        startDate: '2024-01-01',
        endDate: null,
        description: { es: '', en: '' },
        bullets: [],
        technologies: [],
      },
      {
        id: 'r2',
        companyId: 'c1',
        title: { es: '', en: '' },
        sector: { es: 'FinTech', en: 'FinTech' },
        mode: { es: '', en: '' },
        modeKey: 'remote',
        startDate: '2023-01-01',
        endDate: '2024-01-01',
        description: { es: '', en: '' },
        bullets: [],
        technologies: [],
      },
    ],
  },
  {
    id: 'c2',
    name: 'B',
    logoUrl: null,
    metaLine: { es: '', en: '' },
    roles: [
      {
        id: 'r3',
        companyId: 'c2',
        title: { es: '', en: '' },
        sector: { es: 'Cleantech', en: 'Cleantech' },
        mode: { es: '', en: '' },
        modeKey: 'remote',
        startDate: '2022-01-01',
        endDate: '2023-01-01',
        description: { es: '', en: '' },
        bullets: [],
        technologies: [],
      },
    ],
  },
];

describe('computeYearsOfExperience', () => {
  it('returns years between start and reference', () => {
    expect(computeYearsOfExperience(profile, new Date('2025-07-01'))).toBe(3);
  });
  it('never returns negative', () => {
    const future = { experienceStartDate: '2099-01-01' } as Profile;
    expect(computeYearsOfExperience(future, new Date('2025-01-01'))).toBe(0);
  });
});

describe('countUniqueSectors', () => {
  it('counts unique sector values across all roles', () => {
    expect(countUniqueSectors(companies)).toBe(2);
  });
  it('returns 0 for no companies', () => {
    expect(countUniqueSectors([])).toBe(0);
  });
});

describe('countProjects', () => {
  it('returns array length', () => {
    expect(countProjects([{} as Project, {} as Project, {} as Project])).toBe(3);
  });
  it('returns 0 for empty array', () => {
    expect(countProjects([])).toBe(0);
  });
});
