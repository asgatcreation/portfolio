/**
 * The search index, assembled at build time and served as /search.json.
 *
 * Every entry is built from content that is already on the site: the project files in
 * src/content/projects, the articles in src/content/articles.json, and the page content in
 * src/data/pages.ts. Nothing here is written by hand twice, so search can never find a claim
 * that the page itself does not make.
 *
 * `body` is the text searched but not shown. It is what makes searching for "row locking",
 * "Playwright" or "kobo" land on the right page instead of finding nothing.
 */
import { getCollection } from 'astro:content';
import { publishedProjects } from './projects';
import { usesGroups, neiFindings, nowWork, nowStudy } from './pages';
import { site } from './site';

export interface SearchEntry {
  /** Group heading in the results list. */
  g: string;
  /** Title shown. */
  t: string;
  /** Subtitle shown. */
  s: string;
  /** Where it goes. */
  u: string;
  /** Searched but not shown. */
  body: string;
  /** One character, drawn as the result's badge. */
  i: string;
}

/**
 * Joins the parts and collapses whitespace. The text is kept as it is written, rather than
 * reduced to a bag of unique words: searching for a phrase like "in person" has to work, and
 * the snippet shown under a result is cut straight out of this text, so it has to read properly.
 */
function words(...parts: (string | undefined | null)[]): string {
  return parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

const PAGES: [string, string, string, string, string][] = [
  // title, url, subtitle, icon, extra keywords
  [
    'About',
    '/about/',
    'Story, experience, education',
    '◉',
    'biography background degree university Ibadan statistics NBS career',
  ],
  ['All projects', '/work/', 'Every project and its true status', '▦', 'portfolio case studies index list'],
  [
    'Services',
    '/services/',
    'What I do and how we work',
    '❖',
    'hire freelance contract full-time consulting rates engagement process',
  ],
  [
    'Research & data',
    '/research/',
    'Findings, datasets and surveys',
    '⌗',
    'economics labour market statistics dissertation survey NBS FAO',
  ],
  ['Lab', '/lab/', 'Three small tools that run in the page', '⚙', 'demos experiments interactive tools'],
  ['AsgatArticles', '/writing/', 'Writing on tech and data', '✎', 'blog posts articles essays'],
  ['CV', '/cv/', 'Full CV and five PDF downloads', '☰', 'resume curriculum vitae download pdf experience'],
  ['Now', '/now/', 'What I am working on this month', '◑', 'current status this month in progress'],
  ['Uses', '/uses/', 'The tools I build with', '⚒', 'setup tooling stack software'],
  [
    'Privacy',
    '/privacy/',
    'What this site collects: almost nothing',
    '⛉',
    'cookies tracking analytics data protection',
  ],
];

export async function searchIndex(): Promise<SearchEntry[]> {
  const projects = await publishedProjects();
  const articles = await getCollection('articles');

  const projectEntries: SearchEntry[] = projects.map((p) => ({
    g: 'Projects',
    t: p.title,
    s: `${p.statusLabel} · ${p.categories.join(', ')}`,
    u: `/work/${p.id}/`,
    i: p.title.charAt(0),
    body: words(
      p.tagline,
      p.summary,
      p.problem,
      p.why,
      p.industry,
      p.year,
      p.categories.join(' '),
      p.languages.join(' '),
      p.stack.join(' '),
      p.features?.join(' '),
      p.flow?.join(' '),
      p.hard?.map(([t, d]) => `${t} ${d}`).join(' '),
      p.parts?.map((pt) => `${pt.name} ${pt.short} ${pt.about} ${pt.features.join(' ')}`).join(' '),
      p.facts.map(([v, l]) => `${v} ${l}`).join(' '),
      p.note,
    ),
  }));

  const articleEntries: SearchEntry[] = articles.map((a) => ({
    g: 'AsgatArticles',
    t: a.data.title,
    s: `${a.data.tag} · from ${a.data.from} · ${a.data.mins} min read${a.data.status === 'planned' ? ' · planned' : ''}`,
    u: '/writing/',
    i: '✎',
    body: words(a.data.tag, a.data.from, a.data.status, 'article writing asgatarticles'),
  }));

  // Page keywords come from the page's own content, so searching for a tool, a finding or a
  // project that is only mentioned on one of these pages still lands somewhere useful.
  const pageBody: Record<string, string> = {
    '/uses/': usesGroups.map(([group, rows]) => `${group} ${rows.map(([n, w]) => `${n} ${w}`).join(' ')}`).join(' '),
    '/research/': neiFindings.map(([t, d]) => `${t} ${d}`).join(' '),
    '/now/': [...nowWork, ...nowStudy].map((n) => `${n.what} ${n.where} ${n.detail}`).join(' '),
    '/about/': `${site.name} ${site.brand} ${site.headline} ${site.location}`,
  };

  const pageEntries: SearchEntry[] = PAGES.map(([t, u, s, i, extra]) => ({
    g: 'Pages',
    t,
    s,
    u,
    i,
    body: words(s, extra, pageBody[u]),
  }));

  return [...projectEntries, ...articleEntries, ...pageEntries];
}
