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
