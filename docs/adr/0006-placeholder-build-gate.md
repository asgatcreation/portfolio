# 0006 — Fail the build on any `[[ADD: ...]]` placeholder

- Date: 17 November 2026
- Status: Accepted

## Context

The standing rule for this portfolio is that nothing is invented: no made-up clients, numbers, quotes or
testimonials. While the site is being built there are real gaps — EduNexus has no public description or
screenshots yet, and some facts still need Gabriel's confirmation. Those gaps are written as
`[[ADD: what is needed]]`.

The risk is obvious: a placeholder reaching the live site, where a visitor or a client would read it.

## Decision

`scripts/check-placeholders.mjs` walks the built `dist/` folder after every build, matches the placeholder
pattern in `.html`, `.xml`, `.json`, `.txt` and `.js` files, prints every file that contains one, and exits
with a failure. `npm run build` is `astro build && node scripts/check-placeholders.mjs`, so the gate runs
locally and in CI, and a failing build cannot be deployed.

Content that still has gaps stays in the repository with `"draft": true`, which keeps it out of the build
until it is complete — that is how EduNexus is held today.

## Consequences

Good: the honesty rule is enforced by a machine rather than by memory. It also catches the subtle case —
a placeholder bundled into the home-page JavaScript rather than visible in the HTML, which is exactly how
it was first caught.

Costs: the gate checks the built output, so a placeholder inside an unused source file passes. That is the
right trade: the rule is about what reaches a reader. Drafts must be remembered and finished; they are
listed in `docs/PROGRESS.md` under "Still needed from you".
