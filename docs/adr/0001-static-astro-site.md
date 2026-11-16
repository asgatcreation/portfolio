# 0001 — Build the site as a static Astro site

- Date: 17 November 2026
- Status: Accepted

## Context

The portfolio is one person's work: a home page, a page per project, writing, and a few standing pages.
The content changes when Gabriel finishes a project, not minute by minute. It has to load fast on a
Nigerian phone connection, work on cheap hosting, read well to search engines, and still show
everything if JavaScript fails.

Options considered:

1. **Astro, static output.** HTML is built once; JavaScript is added only where it is needed.
2. **Next.js.** More power than this site needs, and a server to keep running.
3. **Hand-written HTML.** No build step, but every project would be copied by hand, so facts would drift.

## Decision

Astro 7, static output (no adapter, no server). Pages are `.astro` files; shared pieces are components;
`src/pages/work/[slug].astro` builds one page per project from the content collection.

Settings worth naming: `trailingSlash: 'always'` and `build.format: 'directory'`, so every URL ends in `/`
and the same path works on any static host. The sitemap integration only turns on when `SITE_URL` is set,
so local builds don't produce a sitemap full of localhost links.

## Consequences

Good: pages are plain HTML, so the site is fast, cheap to host, easy to crawl, and readable with
JavaScript off. The build runs the type checker and the content schema, so a broken fact stops the build
instead of reaching the site.

Costs: anything that needs a server (the contact form actually sending mail, search over posts) has to be
added as a separate piece — a host function or a third-party endpoint — rather than being part of the page.
That is why the contact form currently hands off to mail and WhatsApp (milestone 3) and gets a real
endpoint later.
