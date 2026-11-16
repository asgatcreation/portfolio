# 0005 — Write the interactions in plain JavaScript, no framework

- Date: 17 November 2026
- Status: Accepted

## Context

The approved design is heavily interactive: a particle canvas, stacking showcase cards that scale as you
scroll, filters and search over the project grid, a slide-up project viewer, tabs inside it, a command
palette, counters that count up when they come into view, a theme switch, galleries with a lightbox,
booking and message forms, and a live panel reading the GitHub API.

The pages themselves are static (ADR 0001), so a framework would only be shipped for these behaviours.

Options considered:

1. **Plain JavaScript in two files**, one for the home page and one for inner pages.
2. **React or Preact islands.** Familiar, but it ships a runtime for behaviour that is mostly
   "listen, measure, add a class".
3. **Alpine or a similar small library.** Smaller, but it puts logic into HTML attributes, which is harder
   to lint and to keep accessible.

## Decision

Plain JavaScript: `src/scripts/app.js` for the home page and `src/scripts/site.js` for inner pages, both
bundled by Astro. No runtime dependencies at all — `package.json` has exactly two of them (Astro and the
sitemap integration), and neither reaches the browser.

Rules the scripts follow:

- Elements are built with a small `h()` helper that only ever sets `textContent`, never `innerHTML`,
  so project text cannot inject markup.
- Everything important works without JavaScript: gallery items are real `<a>` links to the image; the
  charts and the complexity radar are SVG rendered at build time; `/work/<id>/` links are ordinary links
  that the script upgrades into the slide-up viewer, with a "Full page" link inside it.
- `prefers-reduced-motion: reduce` turns off the particle canvas, the scroll animation and smooth
  scrolling.
- Overlays trap focus and close on Escape; tabs, the filter list and the palette use real ARIA roles.

## Consequences

Good: no framework to keep up to date, nothing to hydrate, and the whole behaviour layer is two readable
files. The site still works with scripts blocked.

Costs: state is managed by hand, so an interaction added later needs care around focus and cleanup. If the
site ever grows a part with genuinely complex state, that part can become a single Astro island without
changing anything else.
