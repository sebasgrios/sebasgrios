import type { Locale, Localized } from '@/config/i18n';
import type { Database } from '@/lib/data/database.types';
import type {
  Company,
  Education,
  ModeKey,
  Profile,
  Project,
  Role,
  StackGroup,
  Technology,
} from '@/lib/domain/types';

type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

function toLocalized(value: unknown): Localized<string> {
  if (value && typeof value === 'object' && 'es' in value && 'en' in value) {
    const v = value as Record<Locale, unknown>;
    return {
      es: typeof v.es === 'string' ? v.es : '',
      en: typeof v.en === 'string' ? v.en : '',
    };
  }
  return { es: '', en: '' };
}

function toLocalizedArray(value: unknown): Localized<string>[] {
  if (!Array.isArray(value)) return [];
  return value.map(toLocalized);
}

export function mapProfile(row: Row<'profile'>): Profile {
  return {
    id: row.id,
    fullName: row.full_name,
    shortName: row.short_name,
    role: toLocalized(row.role),
    lead: toLocalized(row.lead),
    statusLabel: toLocalized(row.status_label),
    isOpenToWork: row.is_open_to_work,
    heroBadges: toLocalizedArray(row.hero_badges),
    experienceStartDate: row.experience_start_date,
    avatarUrl: row.avatar_url,
    photoUrl: row.photo_url,
    email: row.email,
    linkedinUrl: row.linkedin_url,
    githubUrl: row.github_url,
    contactTitle: toLocalized(row.contact_title),
    contactLead: toLocalized(row.contact_lead),
    metaTitle: toLocalized(row.meta_title),
    metaDescription: toLocalized(row.meta_description),
  };
}

export function mapTechnology(row: Row<'technologies'>): Technology {
  return {
    id: row.id,
    key: row.key,
    label: row.label,
    iconKey: row.icon_key,
  };
}

export function mapRole(row: Row<'roles'>, technologies: Technology[]): Role {
  return {
    id: row.id,
    companyId: row.company_id,
    title: toLocalized(row.title),
    sector: toLocalized(row.sector),
    mode: toLocalized(row.mode),
    modeKey: row.mode_key as ModeKey,
    startDate: row.start_date,
    endDate: row.end_date,
    description: toLocalized(row.description),
    bullets: toLocalizedArray(row.bullets),
    technologies,
  };
}

export function mapCompany(row: Row<'companies'>, roles: Role[]): Company {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    metaLine: toLocalized(row.meta_line),
    roles,
  };
}

export function mapEducation(row: Row<'education'>, technologies: Technology[]): Education {
  return {
    id: row.id,
    title: toLocalized(row.title),
    school: row.school,
    startDate: row.start_date,
    endDate: row.end_date,
    description: toLocalized(row.description),
    bullets: toLocalizedArray(row.bullets),
    technologies,
  };
}

export function mapStackGroup(row: Row<'stack_groups'>, technologies: Technology[]): StackGroup {
  return {
    id: row.id,
    label: toLocalized(row.label),
    iconKey: row.icon_key,
    technologies,
  };
}

export function mapProject(row: Row<'projects'>, technologies: Technology[]): Project {
  return {
    id: row.id,
    name: row.name,
    description: toLocalized(row.description),
    imageUrl: row.image_url,
    liveUrl: row.live_url,
    codeUrl: row.code_url,
    technologies,
  };
}
