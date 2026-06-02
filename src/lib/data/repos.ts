import type { Localized } from '@/config/i18n';
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

function joinWithTechnologies<TRow extends { id: string }, TPivot, TEntity>(
  rows: TRow[],
  pivots: TPivot[],
  getEntityId: (pivot: TPivot) => string,
  getTechId: (pivot: TPivot) => string,
  mapper: (row: TRow, techs: Technology[]) => TEntity,
  techById: Map<string, Technology>
): TEntity[] {
  const techsByEntity = new Map<string, Technology[]>();
  for (const pivot of pivots) {
    const tech = techById.get(getTechId(pivot));
    if (!tech) continue;
    const entityId = getEntityId(pivot);
    const list = techsByEntity.get(entityId) ?? [];
    list.push(tech);
    techsByEntity.set(entityId, list);
  }
  return rows.map((row) => mapper(row, techsByEntity.get(row.id) ?? []));
}

function assertOk<T>(
  result: { data: T | null; error: { message: string } | null },
  label: string
): T {
  if (result.error) throw new Error(`${label} fetch failed: ${result.error.message}`);
  if (result.data === null) throw new Error(`${label} returned no data`);
  return result.data;
}

export async function fetchProfile(): Promise<Profile> {
  const client = getServerClient();
  const res = await client.from('profile').select('*').limit(1).single();
  return mapProfile(assertOk(res, 'profile'));
}

export async function fetchTechnologiesAdmin(): Promise<(Technology & { sortOrder: number })[]> {
  const client = getServerClient();
  const res = await client
    .from('technologies')
    .select('*')
    .order('sort_order', { ascending: true });
  const rows = assertOk(res, 'technologies');
  return rows.map((row) => ({ ...mapTechnology(row), sortOrder: row.sort_order }));
}

export interface StackGroupAdmin {
  id: string;
  label: Localized<string>;
  iconKey: string;
  sortOrder: number;
  technologyIds: string[];
}

export async function fetchStackGroupsAdmin(): Promise<StackGroupAdmin[]> {
  const client = getServerClient();
  const [groupsRes, pivotRes] = await Promise.all([
    client.from('stack_groups').select('*').order('sort_order', { ascending: false }),
    client.from('stack_group_technologies').select('*').order('sort_order', { ascending: true }),
  ]);
  const groups = assertOk(groupsRes, 'stack_groups');
  const pivots = assertOk(pivotRes, 'stack_group_technologies');

  const techByGroup = new Map<string, string[]>();
  for (const pivot of pivots) {
    const list = techByGroup.get(pivot.stack_group_id) ?? [];
    list.push(pivot.technology_id);
    techByGroup.set(pivot.stack_group_id, list);
  }

  return groups.map((row) => {
    const group = mapStackGroup(row, []);
    return {
      id: group.id,
      label: group.label,
      iconKey: group.iconKey,
      sortOrder: row.sort_order,
      technologyIds: techByGroup.get(row.id) ?? [],
    };
  });
}

export interface EducationAdmin {
  id: string;
  title: Localized<string>;
  school: string;
  startDate: string;
  endDate: string | null;
  description: Localized<string>;
  bullets: Localized<string>[];
  sortOrder: number;
  technologyIds: string[];
}

export async function fetchEducationAdmin(): Promise<EducationAdmin[]> {
  const client = getServerClient();
  const [rowsRes, pivotRes] = await Promise.all([
    client.from('education').select('*').order('sort_order', { ascending: false }),
    client.from('education_technologies').select('*').order('sort_order', { ascending: true }),
  ]);
  const rows = assertOk(rowsRes, 'education');
  const pivots = assertOk(pivotRes, 'education_technologies');

  const techByEducation = new Map<string, string[]>();
  for (const pivot of pivots) {
    const list = techByEducation.get(pivot.education_id) ?? [];
    list.push(pivot.technology_id);
    techByEducation.set(pivot.education_id, list);
  }

  return rows.map((row) => {
    const education = mapEducation(row, []);
    return {
      id: education.id,
      title: education.title,
      school: education.school,
      startDate: education.startDate,
      endDate: education.endDate,
      description: education.description,
      bullets: education.bullets,
      sortOrder: row.sort_order,
      technologyIds: techByEducation.get(row.id) ?? [],
    };
  });
}

export interface RoleAdmin {
  id: string;
  companyId: string;
  title: Localized<string>;
  sector: Localized<string>;
  mode: Localized<string>;
  modeKey: string;
  startDate: string;
  endDate: string | null;
  description: Localized<string>;
  bullets: Localized<string>[];
  sortOrder: number;
  technologyIds: string[];
}

export interface CompanyAdmin {
  id: string;
  name: string;
  logoUrl: string | null;
  metaLine: Localized<string>;
  sortOrder: number;
  roles: RoleAdmin[];
}

export async function fetchCompaniesAdmin(): Promise<CompanyAdmin[]> {
  const client = getServerClient();
  const [companiesRes, rolesRes, pivotRes] = await Promise.all([
    client.from('companies').select('*').order('sort_order', { ascending: false }),
    client.from('roles').select('*').order('sort_order', { ascending: false }),
    client.from('role_technologies').select('*').order('sort_order', { ascending: true }),
  ]);
  const companies = assertOk(companiesRes, 'companies');
  const roles = assertOk(rolesRes, 'roles');
  const pivots = assertOk(pivotRes, 'role_technologies');

  const techByRole = new Map<string, string[]>();
  for (const pivot of pivots) {
    const list = techByRole.get(pivot.role_id) ?? [];
    list.push(pivot.technology_id);
    techByRole.set(pivot.role_id, list);
  }

  const rolesByCompany = new Map<string, RoleAdmin[]>();
  for (const row of roles) {
    const role = mapRole(row, []);
    const list = rolesByCompany.get(role.companyId) ?? [];
    list.push({
      id: role.id,
      companyId: role.companyId,
      title: role.title,
      sector: role.sector,
      mode: role.mode,
      modeKey: role.modeKey,
      startDate: role.startDate,
      endDate: role.endDate,
      description: role.description,
      bullets: role.bullets,
      sortOrder: row.sort_order,
      technologyIds: techByRole.get(row.id) ?? [],
    });
    rolesByCompany.set(role.companyId, list);
  }

  return companies.map((row) => {
    const company = mapCompany(row, []);
    return {
      id: company.id,
      name: company.name,
      logoUrl: company.logoUrl,
      metaLine: company.metaLine,
      sortOrder: row.sort_order,
      roles: rolesByCompany.get(row.id) ?? [],
    };
  });
}

export async function fetchTechnologyDictionary(): Promise<Map<string, Technology>> {
  const client = getServerClient();
  const res = await client.from('technologies').select('*');
  const rows = assertOk(res, 'technologies');
  const dict = new Map<string, Technology>();
  for (const row of rows) {
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
  const companies = assertOk(companiesRes, 'companies');
  const roles = joinWithTechnologies(
    assertOk(rolesRes, 'roles'),
    assertOk(pivotRes, 'role_technologies'),
    (p) => p.role_id,
    (p) => p.technology_id,
    mapRole,
    techById
  );

  const rolesByCompany = new Map<string, Role[]>();
  for (const role of roles) {
    const list = rolesByCompany.get(role.companyId) ?? [];
    list.push(role);
    rolesByCompany.set(role.companyId, list);
  }
  return companies.map((row) => mapCompany(row, rolesByCompany.get(row.id) ?? []));
}

export async function fetchEducation(techById: Map<string, Technology>): Promise<Education[]> {
  const client = getServerClient();
  const [entitiesRes, pivotRes] = await Promise.all([
    client.from('education').select('*').order('sort_order', { ascending: false }),
    client.from('education_technologies').select('*').order('sort_order', { ascending: true }),
  ]);
  return joinWithTechnologies(
    assertOk(entitiesRes, 'education'),
    assertOk(pivotRes, 'education_technologies'),
    (p) => p.education_id,
    (p) => p.technology_id,
    mapEducation,
    techById
  );
}

export async function fetchStackGroups(techById: Map<string, Technology>): Promise<StackGroup[]> {
  const client = getServerClient();
  const [entitiesRes, pivotRes] = await Promise.all([
    client.from('stack_groups').select('*').order('sort_order', { ascending: false }),
    client.from('stack_group_technologies').select('*').order('sort_order', { ascending: true }),
  ]);
  return joinWithTechnologies(
    assertOk(entitiesRes, 'stack_groups'),
    assertOk(pivotRes, 'stack_group_technologies'),
    (p) => p.stack_group_id,
    (p) => p.technology_id,
    mapStackGroup,
    techById
  );
}

export async function fetchProjects(techById: Map<string, Technology>): Promise<Project[]> {
  const client = getServerClient();
  const [entitiesRes, pivotRes] = await Promise.all([
    client.from('projects').select('*').order('sort_order', { ascending: false }),
    client.from('project_technologies').select('*').order('sort_order', { ascending: true }),
  ]);
  return joinWithTechnologies(
    assertOk(entitiesRes, 'projects'),
    assertOk(pivotRes, 'project_technologies'),
    (p) => p.project_id,
    (p) => p.technology_id,
    mapProject,
    techById
  );
}
