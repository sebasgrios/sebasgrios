import type { Localized } from '@/config/i18n';

export type ModeKey = 'remote' | 'onsite' | 'hybrid';

export interface Profile {
  id: string;
  fullName: string;
  shortName: string;
  role: Localized<string>;
  lead: Localized<string>;
  statusLabel: Localized<string>;
  isOpenToWork: boolean;
  heroBadges: Localized<string>[];
  experienceStartDate: string;
  avatarUrl: string | null;
  photoUrl: string | null;
  email: string;
  linkedinUrl: string | null;
  githubUrl: string | null;
  contactTitle: Localized<string>;
  contactLead: Localized<string>;
  metaTitle: Localized<string>;
  metaDescription: Localized<string>;
}

export interface Technology {
  id: string;
  key: string;
  label: string;
  iconKey: string | null;
}

export interface Role {
  id: string;
  companyId: string;
  title: Localized<string>;
  sector: Localized<string>;
  mode: Localized<string>;
  modeKey: ModeKey;
  startDate: string;
  endDate: string | null;
  description: Localized<string>;
  bullets: Localized<string>[];
  technologies: Technology[];
}

export interface Company {
  id: string;
  name: string;
  logoUrl: string | null;
  metaLine: Localized<string>;
  roles: Role[];
}

export interface Education {
  id: string;
  title: Localized<string>;
  school: string;
  startDate: string;
  endDate: string | null;
  description: Localized<string>;
  bullets: Localized<string>[];
  technologies: Technology[];
}

export interface StackGroup {
  id: string;
  label: Localized<string>;
  iconKey: string;
  technologies: Technology[];
}

export interface Project {
  id: string;
  name: string;
  description: Localized<string>;
  imageUrl: string | null;
  liveUrl: string | null;
  codeUrl: string | null;
  technologies: Technology[];
}

export interface HomeViewModel {
  profile: Profile;
  companies: Company[];
  education: Education[];
  stackGroups: StackGroup[];
  projects: Project[];
  stats: {
    yearsOfExperience: number;
    sectorsCount: number;
    projectsCount: number;
  };
}
