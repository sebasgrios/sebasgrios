import { yearsBetween } from '@/lib/domain/dates';
import type { Company, Profile, Project } from '@/lib/domain/types';

export function computeYearsOfExperience(profile: Profile, reference: Date = new Date()): number {
  return Math.max(0, yearsBetween(profile.experienceStartDate, reference));
}

export function countUniqueSectors(companies: Company[]): number {
  const set = new Set<string>();
  for (const company of companies) {
    for (const role of company.roles) {
      const key = role.sector.es.trim().toLowerCase();
      if (key) set.add(key);
    }
  }
  return set.size;
}

export function countProjects(projects: Project[]): number {
  return projects.length;
}
