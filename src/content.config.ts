import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const shot = z.tuple([z.string(), z.string()]); // [path under /img/, caption]
const fact = z.tuple([z.string(), z.string()]); // [value, label]
const status = z.enum(['live', 'dev', 'pre', 'report', 'private', 'team']);
const chart = z.object({
  type: z.literal('bars'),
  title: z.string(),
  note: z.string().optional(),
  rows: z.array(z.tuple([z.string(), z.number()])),
  unit: z.string().optional(),
  max: z.number().optional(),
  log: z.boolean().optional(),
});

/** One file per project in src/content/projects. `draft: true` keeps it off the site. */
const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: z
    .object({
      title: z.string(),
      order: z.number().int(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      color: z.string().regex(/^#[0-9a-f]{6}$/i),
      status,
      statusLabel: z.string(),
      progress: z.tuple([z.number().int(), z.number().int()]).optional(),
      year: z.string(),
      industry: z.string().optional(),
      tagline: z.string(),
      summary: z.string(),
      categories: z.array(z.string()).min(1),
      languages: z.array(z.string()).min(1),
      stack: z.array(z.string()).min(1),
      facts: z.array(fact),
      demo: z.url().optional(),
      demoLabel: z.string().optional(),
      code: z.url().optional(),
      problem: z.string(),
      why: z.string().optional(),
      note: z.string().optional(),
      cover: z.string().startsWith('/img/').optional(),
      phone: z.string().startsWith('/img/').optional(),
      art: z.tuple([z.string(), z.string()]).optional(),
      features: z.array(z.string()).optional(),
      shots: z.array(shot).default([]),
      extra: z.array(shot).optional(),
      parts: z
        .array(
          z.object({
            name: z.string(),
            short: z.string(),
            icon: z.enum(['car', 'parts', 'ride']),
            about: z.string(),
            features: z.array(z.string()),
            shots: z.array(shot),
          }),
        )
        .optional(),
      flow: z.array(z.string()).optional(),
      hard: z.array(z.tuple([z.string(), z.string()])).optional(),
      radar: z.array(z.number().min(1).max(5)).length(6).nullable().optional(),
      arch: z.record(z.string(), z.array(z.string())).nullable().optional(),
      chart: chart.optional(),
      chart2: chart.optional(),
    })
    .refine((p) => p.status !== 'dev' || p.progress !== undefined || p.statusLabel === 'In development', {
      message: 'In-development projects need `progress` or the plain "In development" label',
    }),
});

/** Planned and published articles for AsgatArticles. */
const articles = defineCollection({
  loader: file('./src/content/articles.json'),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    from: z.string(),
    mins: z.number().int(),
    status: z.enum(['planned', 'published']),
  }),
});

export const collections = { projects, articles };
