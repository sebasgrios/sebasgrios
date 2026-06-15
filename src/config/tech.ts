import type { IconName } from '@/components/icons/paths';

/**
 * Technology registry: brand colour per technology, used for the tech-tag glow
 * on hover/focus and to tint the logo. Names here must match the `tech` arrays
 * in content. Brand-logo glyphs live in `src/components/icons/brand.ts`.
 *
 * A few colours are deliberately overridden from the official brand hex when the
 * latter is pure black (invisible on the dark theme) — GitHub Copilot, Next.js,
 * Java (OpenJDK), MariaDB.
 */
export const TECH: Record<string, string> = {
  React: '#61DAFB',
  'React Native': '#61DAFB',
  'GitHub Copilot': '#A371F7',
  'Claude Code': '#D97757',
  'Next.js': '#888888',
  Moleculer: '#3CAFCE',
  MongoDB: '#47A248',
  Laravel: '#FF2D20',
  MariaDB: '#C0765A',
  Java: '#ED8B00',
  'C#': '#99CC00',
  Astro: '#FF5D01',
  Azure: '#0078D4',
  Cloudflare: '#F38020',
  WordPress: '#21759B',
  Servidores: '#22C55E',
  Personales: '#38BDF8',
};

/**
 * Tags that use a generic Lucide icon (no brand logo) instead of a brand mark.
 * Keys must match the `tech` arrays in content.
 */
export const TECH_ICON: Record<string, IconName> = {
  Servidores: 'server',
  Personales: 'laptop',
};

export const techColor = (name: string): string => TECH[name] ?? 'var(--fg-soft)';
