import type { Technology } from '@/lib/domain/types';
import { describe, expect, it } from 'vitest';
import type { Database } from './database.types';
import { mapProfile, mapRole, mapTechnology } from './mappers';

type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

describe('mapProfile', () => {
  it('maps snake_case row to camelCase domain', () => {
    const row: Row<'profile'> = {
      id: 'p-1',
      full_name: 'Sebastián',
      short_name: 'Sebas',
      role: { es: 'Ingeniero', en: 'Engineer' },
      lead: { es: 'L', en: 'L' },
      status_label: { es: 'Abierto', en: 'Open' },
      is_open_to_work: true,
      hero_badges: [{ es: 'A', en: 'A' }],
      experience_start_date: '2022-07-01',
      avatar_url: null,
      photo_url: null,
      email: 'a@b.c',
      linkedin_url: null,
      github_url: null,
      contact_title: { es: 'T', en: 'T' },
      contact_lead: { es: 'L', en: 'L' },
      meta_title: { es: 'M', en: 'M' },
      meta_description: { es: 'D', en: 'D' },
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      is_singleton: true,
    };
    const out = mapProfile(row);
    expect(out.fullName).toBe('Sebastián');
    expect(out.shortName).toBe('Sebas');
    expect(out.isOpenToWork).toBe(true);
    expect(out.role.en).toBe('Engineer');
    expect(out.heroBadges).toHaveLength(1);
  });
});

describe('mapTechnology', () => {
  it('maps row preserving key and label', () => {
    const out = mapTechnology({
      id: 't-1',
      key: 'react',
      label: 'React',
      icon_key: null,
      sort_order: 10,
      created_at: '2025-01-01',
    });
    expect(out.key).toBe('react');
    expect(out.label).toBe('React');
    expect(out.iconKey).toBeNull();
  });
});

describe('mapRole', () => {
  it('attaches passed technologies array', () => {
    const techs: Technology[] = [{ id: 't-1', key: 'react', label: 'React', iconKey: null }];
    const row: Row<'roles'> = {
      id: 'r-1',
      company_id: 'c-1',
      title: { es: 'T', en: 'T' },
      sector: { es: 'S', en: 'S' },
      mode: { es: 'En remoto', en: 'Remote' },
      mode_key: 'remote',
      start_date: '2024-01-01',
      end_date: null,
      description: { es: 'D', en: 'D' },
      bullets: [],
      sort_order: 100,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    };
    const out = mapRole(row, techs);
    expect(out.companyId).toBe('c-1');
    expect(out.modeKey).toBe('remote');
    expect(out.technologies).toEqual(techs);
  });
});
