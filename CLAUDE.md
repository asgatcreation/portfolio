# Working on this repository

The portfolio of Akanji Oluwaseun Gabriel (brand: asgatcreation). Astro 7 static site, strict TypeScript,
content collections checked with zod. See `README.md` for commands and layout, `docs/PROGRESS.md` for
where the work stands and `docs/adr/` for decisions.

## Rules that always apply

- **No AI attribution anywhere**: not in commits, PRs, code, comments or the site. Commits are authored by the owner only.
- **Never commit or print secrets.** Secrets go in `.env` (gitignored); document new ones in `.env.example`.
- **Honesty:** never invent clients, numbers, quotes or testimonials. Unknown facts are `[[ADD: ...]]`
  placeholders, and `npm run build` fails if one reaches a published page. Show each project's true status.
- **Don't show other people's names** (for example the students named in the LaTeX thesis repos) without the owner's OK.
- **Ask before:** deleting anything, changing any other repository or the GitHub profile, and anything public or irreversible.
- **Versions:** stable releases only, pinned exactly in `package.json`. Tell the owner which versions were chosen.
  TypeScript stays on 6.x until `@astrojs/check` and `typescript-eslint` support 7 (ADR 0004).
- The owner runs their own servers on ports 8000 and 3000. Don't stop processes you didn't start.
- Plain English in everything the owner reads.

## Definition of done (every milestone)

1. `npm run verify` passes locally and in CI.
2. Checked in a browser at phone, tablet and desktop widths, light and dark, with no console errors
   and working keyboard navigation.
3. `docs/PROGRESS.md` and any affected docs or ADRs are updated.
4. Committed (and pushed once the remote exists), with a short summary for the owner.

## Content facts

- Facts about the owner come from the CVs in `public/cv/` (full version: `Akanji_Oluwaseun_CV_General_Full.pdf`).
- Project facts come from each project's README, checked in November 2026.
- Complexity scores (`radar`) are self-assessed and labelled that way on the site.
