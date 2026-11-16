# 0004 — Pin TypeScript to 6.x

- Date: 17 November 2026
- Status: Accepted

## Context

The rule for this repository is stable releases, pinned exactly. When the dependencies were chosen,
TypeScript 7 and Astro 7.4.11 were the newest releases, but the checking tools had not caught up:

- `@astrojs/check@0.9.12` declares a peer range of TypeScript `^5 || ^6`.
- `typescript-eslint@8.72.1` declares a peer range of `<6.1.0`.

Installing TypeScript 7 therefore meant either `--force` (an unsupported combination, likely to break in
confusing ways) or dropping `astro check` and type-aware linting — the two things that make the content
schema and the strict settings worth having.

## Decision

Pin TypeScript to **6.0.3** and Astro to **7.4.4**. Type checking uses `astro/tsconfigs/strictest`,
which turns on `exactOptionalPropertyTypes` — this is why `astro.config.mjs` adds the optional `site` key
with a conditional spread rather than assigning `undefined`.

## Consequences

Good: `npm run verify` (check, lint, format, build) runs clean with no overrides, and every tool is used
in a combination its maintainers support.

Costs: the repository is one major version behind on TypeScript. Revisit when `@astrojs/check` and
`typescript-eslint` both declare support for TypeScript 7; the upgrade should then be one `npm install`
and a run of `npm run verify`. `CLAUDE.md` names this ADR so the pin is not "upgraded" by accident.
