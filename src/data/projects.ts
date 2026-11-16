import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>['data'] & { id: string };

/** Published projects in display order. Drafts never reach the site. */
export async function publishedProjects(): Promise<Project[]> {
  const all = await getCollection('projects', ({ data }) => !data.draft);
  return all.map((e) => ({ ...e.data, id: e.id })).sort((a, b) => a.order - b.order);
}
