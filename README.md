# asgatcreation portfolio

The portfolio of **Akanji Oluwaseun Gabriel**: software engineer, data scientist and statistician.
Built with [Astro](https://astro.build) as a fast static site.

## Run it

You need Node.js 24 (see `.nvmrc`).

```bash
npm ci            # install the exact pinned versions
npm run dev       # local site with hot reload
npm test          # tests for the contact function
npm run verify    # type check, lint, format check, tests and build: the same as CI
npm run preview   # serve the built site from dist/
npm run og        # rebuild the social preview cards in public/og/ (commit the result)
npm run a11y      # axe-core over every built page (WCAG 2.1 A and AA); needs a build first
```

## Where things live

| Path                                           | What it is                                                                           |
| ---------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/content/projects/*.json`                  | One file per project. Checked against the schema in `src/content.config.ts`.         |
| `src/content/articles.json`                    | AsgatArticles: planned and published posts.                                          |
| `src/data/site.ts`, `src/data/site-extra.json` | Name, contact details, CV files, booking times.                                      |
| `src/components/home/`                         | The home-page sections.                                                              |
| `src/pages/work/[slug].astro`                  | The full case-study page for each project.                                           |
| `src/pages/*.astro`                            | The standing pages: about, services, now, writing, cv, research, lab, uses, privacy. |
| `src/data/pages.ts`                            | Content for /now/, /uses/ and /research/ (the parts not held as projects).           |
| `src/scripts/app.js`                           | Home-page interactions (showcase, filters, project pop-up, search, forms).           |
| `src/scripts/site.js`                          | Interactions on inner pages (menu, search palette, gallery lightbox).                |
| `src/scripts/lab.js`                           | The three tools on /lab/.                                                            |
| `lib/contact.mjs`                              | The contact form's logic, shared by every host. No dependencies.                     |
| `api/contact.js`                               | The contact endpoint on Vercel. A thin wrapper around `lib/contact.mjs`.             |
| `functions/api/contact.js`                     | The same endpoint for Cloudflare Pages, kept so the site can move back.              |
| `tests/`                                       | Tests for the contact logic and both host wrappers.                                  |
| `src/styles/global.css`                        | Design tokens and all styles.                                                        |
| `public/img`, `public/cv`                      | Screenshots, portrait, logo and the five CV PDFs.                                    |
| `design/mockups/`                              | The design mockups from milestone 2 (not part of the site).                          |
| `docs/`                                        | Research, progress log and architecture decision records.                            |
| `docs/DEPLOY.md`                               | Step-by-step: putting the site live on Vercel, and the contact form keys.            |

## Updating a project

Open `src/content/projects/<name>.json` and edit it. For example, when a project goes live:

```json
"status": "live",
"statusLabel": "Live",
"demo": "https://your-demo-url"
```

Remove `progress` at the same time. The schema rejects mistakes, and the build fails if any
`[[ADD: ...]]` placeholder would reach a published page. Set `"draft": true` to hide a project.

## Licences

Code: MIT (`LICENSE`). Content, CVs, photos, logo and screenshots: all rights reserved (`LICENSE-CONTENT.md`).
