import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Bilingual string field. */
const localized = z.object({
  es: z.string(),
  en: z.string(),
});

const workMode = z.enum(['remote', 'hybrid', 'onsite']);

/** Shared schema for timeline entries (experience + education). */
const timelineSchema = z.object({
  // Brand-logo slug (maps to a `tl-card__logo--<slug>` mask + an asset in
  // /public/brand). Null → fall back to a kind icon (school / office).
  logoImg: z.string().nullable().default(null),
  org: localized,
  role: localized,
  // ISO year-month, e.g. "2022-07". `end: null` means "present".
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .nullable(),
  mode: workMode,
  loc: z.string(),
  sector: localized,
  desc: localized,
  tech: z.array(z.string()),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/experience' }),
  schema: timelineSchema,
});

const education = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/education' }),
  schema: timelineSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    date: z.string(),
    // Screenshot slug → optimized webp in src/assets/projects. Null → placeholder.
    image: z.string().nullable().default(null),
    desc: localized,
    tech: z.array(z.string()),
    demo: z.url(),
    repo: z.url().nullable(),
    privateRepo: z.boolean().default(false),
    // Display order, most-recent first (lowest number first).
    order: z.number(),
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/settings' }),
  schema: z.object({
    lead: localized,
    interests: z.array(
      z.object({
        icon: z.string(),
        title: localized,
        desc: localized,
      }),
    ),
  }),
});

export const collections = { experience, education, projects, settings };
