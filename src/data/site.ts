import extra from './site-extra.json';

/** Facts about the person and site. Source: the CVs in public/cv (November 2026). */
export const site = {
  name: 'Akanji Oluwaseun Gabriel',
  brand: 'asgatcreation',
  headline: 'Software engineer, data scientist & statistician',
  description:
    'Software engineer, data scientist and statistician in Nigeria. I build web platforms, apps and data products for every industry: fintech, edtech, agritech, health, e-commerce and government.',
  location: 'Oyo, Nigeria',
  email: extra.contact.email,
  whatsapp: extra.contact.whatsapp,
  phone: extra.contact.phone,
  github: 'https://github.com/asgatcreation',
  linkedin: 'https://www.linkedin.com/in/oluwaseun-akanji-1361a2127/',
  x: 'https://twitter.com/Iam_Asgat',
} as const;

export const radarAxes: string[] = extra.radarAxes;
export const cvs: [string, string, string][] = extra.cvs as [string, string, string][];
export const contact = extra.contact;

export const statusName: Record<string, string> = {
  live: 'Live',
  dev: 'In development',
  pre: 'Pre-release',
  report: 'Report',
  private: 'Private',
  team: 'Team project',
};
