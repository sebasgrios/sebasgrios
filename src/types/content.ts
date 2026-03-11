export type TechnologyId =
  | 'astro'
  | 'cloudflare'
  | 'mysql'
  | 'nextjs'
  | 'redux'
  | 'tailwindcss'
  | 'typescript'
  | 'wordpress';

export type TimelineEntryKind = 'education' | 'job';

export interface ExperienceDate {
  month: number;
  year: number;
}

export interface ExperienceEntry {
  title: string;
  organization: string;
  date: ExperienceDate;
  kind: TimelineEntryKind;
  isActive?: boolean;
  summary?: string;
  highlights: string[];
}

export interface ProjectEntry {
  title: string;
  description: string;
  image: ImageMetadata;
  technologies: TechnologyId[];
  liveUrl?: string;
  codeUrl?: string;
}
