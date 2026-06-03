import {
  fetchCompaniesWithRoles,
  fetchEducation,
  fetchProfile,
  fetchProjects,
  fetchStackGroups,
  fetchTechnologyDictionary,
} from '@/lib/data/repos';
import { computeYearsOfExperience, countProjects, countUniqueSectors } from '@/lib/domain/stats';
import type { HomeViewModel } from '@/lib/domain/types';

export async function loadHomeData(): Promise<HomeViewModel> {
  const [profile, techById] = await Promise.all([fetchProfile(), fetchTechnologyDictionary()]);
  const [companies, education, stackGroups, projects] = await Promise.all([
    fetchCompaniesWithRoles(techById),
    fetchEducation(techById),
    fetchStackGroups(techById),
    fetchProjects(techById),
  ]);

  return {
    profile,
    companies,
    education,
    stackGroups,
    projects,
    stats: {
      yearsOfExperience: computeYearsOfExperience(profile),
      sectorsCount: countUniqueSectors(companies),
      projectsCount: countProjects(projects),
    },
  };
}
