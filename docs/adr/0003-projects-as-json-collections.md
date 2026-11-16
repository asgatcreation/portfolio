# 0003 — Keep project content as JSON checked by zod

- Date: 17 November 2026
- Status: Accepted

## Context

Each project needs a lot of structured detail: status, progress, categories, languages, stack, facts,
why it was built, hard problems, complexity scores, architecture, charts, screenshots, and (for CarHub)
three products inside one project. The same project appears in four places: the home showcase, the
explorer grid, the pop-up viewer, and its own case-study page.

If that detail lived inside the page markup it would be copied four times and drift. It also has to be
possible to hide a project that is not ready, and to be sure that a project marked "In development" really
carries progress numbers.

Options considered:

1. **One JSON file per project in an Astro content collection, with a zod schema.**
2. **Markdown with frontmatter.** Good for prose, awkward for nested data like `parts` and `chart.rows`.
3. **A TypeScript file exporting an array.** Type-checked, but a typo in a colour or a missing field is
   only caught if the types are written by hand, and non-developers cannot edit it safely.

## Decision

`src/content/projects/<id>.json`, loaded by the `glob` loader and validated by the schema in
`src/content.config.ts`. The file name is the project id and therefore the URL (`/work/<id>/`).

The schema does real work, not just typing:

- `color` must match `/^#[0-9a-f]{6}$/i`.
- `status` is one of `live | dev | pre | report | private | team`.
- `cover` must start with `/img/`.
- `radar` must be exactly six numbers between 1 and 5, to match the six axes in `src/data/site.ts`.
- a `refine` rule: a project with `status: 'dev'` must either carry `progress` or say so in `statusLabel`.
- `draft: true` hides a project everywhere (`publishedProjects()` filters it out).

The same JSON feeds the server-rendered pages and, as one sanitised `<script type="application/json">`
block, the home-page JavaScript — so there is one copy of every fact.

## Consequences

Good: a wrong or missing fact fails `npm run build` with the file name and the field. Updating a project
when it goes live is a three-line edit in one file (see `README.md`). EduNexus can sit in the repository as
a draft while its details are still missing.

Costs: long prose in JSON is awkward to write (no line breaks, quotes must be escaped). If a project ever
needs real article-length writing, that belongs in an AsgatArticles post that links to the case study.
