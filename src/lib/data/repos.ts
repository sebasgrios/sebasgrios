import { getServerClient } from '@/lib/data/client';
import {
  mapCompany,
  mapEducation,
  mapProfile,
  mapProject,
  mapRole,
  mapStackGroup,
  mapTechnology,
} from '@/lib/data/mappers';
import type {
  Company,
  Education,
  Profile,
  Project,
  Role,
  StackGroup,
  Technology,
} from '@/lib/domain/types';

export async function fetchProfile(): Promise<Profile> {
  const client = getServerClient();
  const { data, error } = await client.from('profile').select('*').limit(1).single();
  if (error) throw new Error(`profile fetch failed: ${error.message}`);
  return mapProfile(data);
}

export async function fetchTechnologyDictionary(): Promise<Map<string, Technology>> {
  const client = getServerClient();
  const { data, error } = await client.from('technologies').select('*');
  if (error) throw new Error(`technologies fetch failed: ${error.message}`);
  const dict = new Map<string, Technology>();
  for (const row of data) {
    const tech = mapTechnology(row);
    dict.set(tech.id, tech);
  }
  return dict;
}

export async function fetchCompaniesWithRoles(
  techById: Map<string, Technology>
): Promise<Company[]> {
  const client = getServerClient();

  const [companiesRes, rolesRes, pivotRes] = await Promise.all([
    client.from('companies').select('*').order('sort_order', { ascending: false }),
    client.from('roles').select('*').order('sort_order', { ascending: false }),
    client.from('role_technologies').select('*').order('sort_order', { ascending: true }),
  ]);

  if (companiesRes.error) throw new Error(`companies fetch failed: ${companiesRes.error.message}`);
  if (rolesRes.error) throw new Error(`roles fetch failed: ${rolesRes.error.message}`);
  if (pivotRes.error) throw new Error(`role_technologies fetch failed: ${pivotRes.error.message}`);

  const techsByRole = new Map<string, Technology[]>();
  for (const pivot of pivotRes.data) {
    const tech = techById.get(pivot.technology_id);
    if (!tech) continue;
    const list = techsByRole.get(pivot.role_id) ?? [];
    list.push(tech);
    techsByRole.set(pivot.role_id, list);
  }

  const rolesByCompany = new Map<string, Role[]>();
  for (const roleRow of rolesRes.data) {
    const techs = techsByRole.get(roleRow.id) ?? [];
    const role = mapRole(roleRow, techs);
    const list = rolesByCompany.get(role.companyId) ?? [];
    list.push(role);
    rolesByCompany.set(role.companyId, list);
  }

  return companiesRes.data.map((row) => mapCompany(row, rolesByCompany.get(row.id) ?? []));
}

export async function fetchEducation(techById: Map<string, Technology>): Promise<Education[]> {
  const client = getServerClient();

  const [educationRes, pivotRes] = await Promise.all([
    client.from('education').select('*').order('sort_order', { ascending: false }),
    client.from('education_technologies').select('*').order('sort_order', { ascending: true }),
  ]);

  if (educationRes.error) throw new Error(`education fetch failed: ${educationRes.error.message}`);
  if (pivotRes.error)
    throw new Error(`education_technologies fetch failed: ${pivotRes.error.message}`);

  const techsByEducation = new Map<string, Technology[]>();
  for (const pivot of pivotRes.data) {
    const tech = techById.get(pivot.technology_id);
    if (!tech) continue;
    const list = techsByEducation.get(pivot.education_id) ?? [];
    list.push(tech);
    techsByEducation.set(pivot.education_id, list);
  }

  return educationRes.data.map((row) => mapEducation(row, techsByEducation.get(row.id) ?? []));
}

export async function fetchStackGroups(techById: Map<string, Technology>): Promise<StackGroup[]> {
  const client = getServerClient();

  const [groupsRes, pivotRes] = await Promise.all([
    client.from('stack_groups').select('*').order('sort_order', { ascending: false }),
    client.from('stack_group_technologies').select('*').order('sort_order', { ascending: true }),
  ]);

  if (groupsRes.error) throw new Error(`stack_groups fetch failed: ${groupsRes.error.message}`);
  if (pivotRes.error)
    throw new Error(`stack_group_technologies fetch failed: ${pivotRes.error.message}`);

  const techsByGroup = new Map<string, Technology[]>();
  for (const pivot of pivotRes.data) {
    const tech = techById.get(pivot.technology_id);
    if (!tech) continue;
    const list = techsByGroup.get(pivot.stack_group_id) ?? [];
    list.push(tech);
    techsByGroup.set(pivot.stack_group_id, list);
  }

  return groupsRes.data.map((row) => mapStackGroup(row, techsByGroup.get(row.id) ?? []));
}

export async function fetchProjects(techById: Map<string, Technology>): Promise<Project[]> {
  const client = getServerClient();

  const [projectsRes, pivotRes] = await Promise.all([
    client.from('projects').select('*').order('sort_order', { ascending: false }),
    client.from('project_technologies').select('*').order('sort_order', { ascending: true }),
  ]);

  if (projectsRes.error) throw new Error(`projects fetch failed: ${projectsRes.error.message}`);
  if (pivotRes.error)
    throw new Error(`project_technologies fetch failed: ${pivotRes.error.message}`);

  const techsByProject = new Map<string, Technology[]>();
  for (const pivot of pivotRes.data) {
    const tech = techById.get(pivot.technology_id);
    if (!tech) continue;
    const list = techsByProject.get(pivot.project_id) ?? [];
    list.push(tech);
    techsByProject.set(pivot.project_id, list);
  }

  return projectsRes.data.map((row) => mapProject(row, techsByProject.get(row.id) ?? []));
}
