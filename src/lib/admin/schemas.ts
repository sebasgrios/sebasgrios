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
