import { z } from 'zod';

const requiredLocalized = z.object({
  es: z.string().trim().min(1),
  en: z.string().trim().min(1),
});

const urlOrNull = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}, z.string().url().nullable());

export const profileInputSchema = z.object({
  fullName: z.string().trim().min(1),
  shortName: z.string().trim().min(1),
  role: requiredLocalized,
  lead: requiredLocalized,
  statusLabel: requiredLocalized,
  isOpenToWork: z.boolean(),
  heroBadges: z.array(requiredLocalized).max(4),
  experienceStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD'),
  avatarUrl: urlOrNull,
  photoUrl: urlOrNull,
  email: z.string().trim().email(),
  linkedinUrl: urlOrNull,
  githubUrl: urlOrNull,
  contactTitle: requiredLocalized,
  contactLead: requiredLocalized,
  metaTitle: requiredLocalized,
  metaDescription: requiredLocalized,
});

export type ProfileInput = z.infer<typeof profileInputSchema>;

const emptyToNull = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? null : value;

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD');

export const technologyInputSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9.+-]+$/, 'minúsculas, números, puntos o guiones'),
  label: z.string().trim().min(1),
  iconKey: z.preprocess(emptyToNull, z.string().trim().nullable()),
  sortOrder: z.coerce.number().int().min(0),
});

export type TechnologyInput = z.infer<typeof technologyInputSchema>;

export const STACK_ICON_KEYS = ['code', 'mobile', 'git', 'spark', 'chart', 'layers'] as const;

export const stackGroupInputSchema = z.object({
  label: requiredLocalized,
  iconKey: z.enum(STACK_ICON_KEYS),
  sortOrder: z.coerce.number().int().min(0),
  technologyIds: z.array(z.string().uuid()),
});

export type StackGroupInput = z.infer<typeof stackGroupInputSchema>;

export const educationInputSchema = z.object({
  title: requiredLocalized,
  school: z.string().trim().min(1),
  startDate: dateString,
  endDate: z.preprocess(emptyToNull, dateString.nullable()),
  description: requiredLocalized,
  bullets: z.array(requiredLocalized).max(12),
  sortOrder: z.coerce.number().int().min(0),
  technologyIds: z.array(z.string().uuid()),
});

export type EducationInput = z.infer<typeof educationInputSchema>;

export const companyInputSchema = z.object({
  name: z.string().trim().min(1),
  logoUrl: urlOrNull,
  metaLine: requiredLocalized,
  sortOrder: z.coerce.number().int().min(0),
});

export type CompanyInput = z.infer<typeof companyInputSchema>;

export const MODE_KEYS = ['remote', 'onsite', 'hybrid'] as const;

export const roleInputSchema = z.object({
  companyId: z.string().uuid(),
  title: requiredLocalized,
  sector: requiredLocalized,
  mode: requiredLocalized,
  modeKey: z.enum(MODE_KEYS),
  startDate: dateString,
  endDate: z.preprocess(emptyToNull, dateString.nullable()),
  description: requiredLocalized,
  bullets: z.array(requiredLocalized).max(12),
  sortOrder: z.coerce.number().int().min(0),
  technologyIds: z.array(z.string().uuid()),
});

export type RoleInput = z.infer<typeof roleInputSchema>;

export const projectInputSchema = z.object({
  name: z.string().trim().min(1),
  description: requiredLocalized,
  imageUrl: urlOrNull,
  liveUrl: urlOrNull,
  codeUrl: urlOrNull,
  sortOrder: z.coerce.number().int().min(0),
  technologyIds: z.array(z.string().uuid()),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
