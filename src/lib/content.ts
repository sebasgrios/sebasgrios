import { getCollection } from 'astro:content';

export type TimelineKind = 'work' | 'edu';

export interface TimelineItem {
  id: string;
  kind: TimelineKind;
  logoImg: string | null;
  org: { es: string; en: string };
  role: { es: string; en: string };
  start: string;
  end: string | null;
  mode: 'remote' | 'hybrid' | 'onsite';
  loc: string;
  sector: { es: string; en: string };
  desc: { es: string; en: string };
  tech: string[];
}

/**
 * Single timeline merging experience + education, sorted newest → oldest by
 * start date (the "Trayectoria" section renders them as one line).
 */
export async function getTimeline(): Promise<TimelineItem[]> {
  const [work, edu] = await Promise.all([getCollection('experience'), getCollection('education')]);

  const items: TimelineItem[] = [
    ...work.map((e) => ({ id: e.id, kind: 'work' as const, ...e.data })),
    ...edu.map((e) => ({ id: e.id, kind: 'edu' as const, ...e.data })),
  ];

  return items.sort((a, b) => b.start.localeCompare(a.start));
}

/** Projects sorted most-recent first (by explicit `order`). */
export async function getProjects() {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order);
}

/** The single "Now" settings entry (lead + interests). */
export async function getNow() {
  const entries = await getCollection('settings');
  const now = entries.find((e) => e.id === 'now');
  if (!now) throw new Error('Missing settings/now.yml content entry');
  return now.data;
}
