# Progress

Where the portfolio stands, newest milestone first. Updated 17 November 2026.

| Milestone | What it covers                                                                   | Status                  |
| --------- | -------------------------------------------------------------------------------- | ----------------------- |
| 1         | Research: every repo read, every demo link checked                               | Done — 11 November 2026 |
| 2         | Visual direction: mockups, chosen and refined                                    | Done — 16 November 2026 |
| 3         | The real site: Astro build of the approved direction                             | Done — 17 November 2026 |
| 4         | Remaining pages: about, services, now, writing, cv, lab, research, uses, privacy | Done — 17 November 2026 |
| 5         | Contact form that really sends (host function, spam check)                       | Done — 17 November 2026 |
| 6         | Search over projects and AsgatArticles                                           | Not started             |
| 7         | Social preview images, metadata and structured data                              | Not started             |
| 8         | First AsgatArticles posts                                                        | Not started             |
| 9         | Online booking                                                                   | Not started             |
| 10        | Privacy-friendly analytics                                                       | Not started             |
| 11        | Checks in CI: Lighthouse budgets, browser tests, spelling                        | Not started             |
| 12        | Accessibility and performance pass on real devices                               | Not started             |
| 13        | Domain, deploy and launch                                                        | Not started             |

---

## Milestone 5 — the contact form really sends (done, 17 November 2026)

The message and booking forms now post to the site's own endpoint instead of only opening your mail app.

**What was built**

- `functions/api/contact.js`: a Cloudflare Pages Function at `POST /api/contact`. No dependencies.
  It validates the fields, ignores anything that fills the hidden honeypot, checks Turnstile when it is
  configured, limits each IP to five messages an hour when a KV namespace is bound, then sends the message
  through Brevo with the visitor's address as reply-to and an acknowledgement back to them.
- Both forms carry the honeypot and, when a Turnstile site key is set at build time, the spam-check widget.
- The page still falls back: if the endpoint is missing (any host without the function), or the network
  fails, it opens the visitor's mail app with the message already written, exactly as before. A real error
  from the function — too many messages, a failed spam check — is shown as a sentence instead.
- 15 tests in `tests/contact.test.mjs` (`npm test`, now part of `npm run verify` and of CI).
- Decisions written up in [ADR 0007](adr/0007-contact-function-brevo-turnstile.md).

**Checked**

- `npm run verify` clean: 0 errors, 15 tests passing, 23 pages built, no placeholders.
- In the browser: a complete message posts to `/api/contact` with every field and clears the form on
  success; a 429 from the server is shown to the visitor and the button re-enables; the booking form posts
  as a booking with the chosen day, time and method; an empty form still blocks with three fields marked
  and focus moved to the first; the honeypot is off-screen and cannot be tabbed into; no console errors.
- What is **not** proved yet: real delivery. That needs the accounts below and a deployed site.

**Still needed from you**

Deployment and the keys, written out click by click in [DEPLOY.md](DEPLOY.md): a Cloudflare Pages
project (15 minutes), then Brevo and Turnstile accounts and five variables (20 minutes). All of it is
free, and every key stays in your own accounts.

------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `/about/` | The long version: portrait, the two working lives, full experience, education, certificates, CV downloads |
| `/services/` | The eight kinds of work, with what each one actually includes; ways to work together; how a project runs; six common questions |
| `/now/` | What is in progress this month, what is simply running, and that I am open to work. Dated, and kept by hand |
| `/writing/` | AsgatArticles: the six articles being written, by topic. Honest that none is published yet |
| `/cv/` | The CV as a web page — profile, key skills, experience, education, selected projects — plus the five PDFs |
| `/research/` | The economic findings with charts, the naija-data datasets, the national surveys, and the two dissertations |
| `/lab/` | Three small tools that run in the page: a NUBAN account checker, a float-versus-kobo demonstration, and a Brownian-motion canvas |
| `/uses/` | 43 tools in eight groups, each with the project that uses it, and how they are chosen |
| `/privacy/` | A plain account: no cookies, no analytics, what the three outside requests are, and what the forms do |

**Also in this milestone**

- The footer now has every page in two columns; the home sections link through to their full pages
  (about, services, now, writing, uses, research, lab).
- Inner pages got a working search. The Ctrl K palette used to do nothing outside the home page; it now
  lists every page and project, filters as you type, moves with the arrow keys and closes with Escape.
- New styles for the page layouts, and one new script (`src/scripts/lab.js`) for the three tools.

**Checked**

- `npm run verify` clean: 0 errors across 48 files, ESLint and Prettier pass, 23 pages built, no placeholders.
- No sideways scroll on any new page at 320, 360, 375, 768, 1024 or 1280 px, in light and dark.
- No console errors on any page.
- The three lab tools were used, not just loaded: the NUBAN checker accepts a correct number, rejects a
  wrong check digit and says which digit would be right; the kobo demonstration shows the float drifting by
  0.0000000002 naira over ten thousand additions; the Brownian canvas draws and reports its own numbers.
- The palette was opened, filtered to one result and closed with Escape.

## Milestone 3 — the real site (done, 17 November 2026)

The approved direction (a classic one-page portfolio in black and gold, with motion) is now a real Astro
site rather than a mockup.

**What was built**

- One home page with 15 sections: hero, stats, featured showcase, project explorer, services, skills,
  about, journey, process, now building, open source, AsgatArticles, FAQ, contact, and the overlay layer
  (project viewer, command palette, lightbox, toast).
- A full case-study page for every project at `/work/<id>/`, in numbered sections: why I built it,
  how it works, what it does (three products in one for CarHub), screens, architecture, technical
  complexity, numbers and charts, tech stack and facts, previous/next.
- An all-projects page at `/work/` and a 404 page.
- 14 pages in total: home, `/work/`, 11 project pages, 404.

**Content**

- 12 project files in `src/content/projects/`, each checked against the zod schema (ADR 0003).
  EduNexus is `draft: true` until you supply its description and screenshots, so 11 are published.
- Facts come from each project README and from your full CV; the complexity scores are self-assessed and
  the site says so.
- 57 skills, five CV downloads, and your portrait (head extracted from the photo you sent, suit added)
  shown in About only, as you asked.
- Real screenshots from CarHub, FloatBook, FinanceFlow and TaskFlow. FloatBook had none in its repo, so
  three were captured from its live demo at 1280×800.
- Wording covers every sector you work in — fintech, edtech, agritech, health, e-commerce, govtech,
  logistics, sport and public data — and every arrangement (freelance, contract, full-time), not fintech
  alone.
- Contact: a message form and a booking form, both validated, plus e-mail, WhatsApp on
  +234 816 094 8723, and the five CVs. The forms currently hand off to your mail app and WhatsApp with
  the message already written; milestone 5 makes them send directly.

**How it is put together**

- Astro 7 static site, strict TypeScript, content collections validated by zod (ADRs 0001, 0003).
- Behaviour in two plain JavaScript files, no framework and no runtime dependencies (ADR 0005). Charts,
  the complexity radar and the architecture diagrams are SVG rendered at build time, so they show without
  JavaScript.
- `npm run build` fails if any `[[ADD: ...]]` placeholder reaches a built page (ADR 0006).
- Versions pinned exactly: Astro 7.4.4, @astrojs/sitemap 3.7.4, TypeScript 6.0.3 (ADR 0004),
  ESLint 10.14.0, typescript-eslint 8.72.1, eslint-plugin-astro 3.2.1, eslint-plugin-jsx-a11y-x 0.2.0,
  Prettier 3.9.10 with prettier-plugin-astro 1.1.2, @astrojs/check 0.9.12. Node 24 (`.nvmrc`).
- CI runs check, lint, format check and build on every push.

**Checked**

- `npm run verify` clean: 0 errors, 0 warnings, 0 hints across 37 files; ESLint and Prettier pass;
  14 pages built, then "No placeholders in the built site."
- In the browser at 320, 375, 768, 1024 and 1280 px wide, in both light and dark: no sideways scroll,
  no console errors, keyboard navigation works, every overlay closes with Escape.
- All 12 `/work/` links return 200, no broken images, all five CV PDFs return 200.
- The booking summary and the WhatsApp and mail links were opened and read back to confirm they carry the
  right text.

**Still needed from you**

1. EduNexus: a short description and screenshots (or your OK to describe it without pictures). It stays
   hidden until then.
2. Your OK on the self-assessed complexity scores shown on the case-study pages.
3. Booking hours — the site currently offers 10:00, 12:00, 14:00 and 16:00 WAT on weekdays, 14 days ahead.
4. Auth Wiki: what your role on it was.
5. Testimonials, if you want them — only real ones, with the person's permission.
6. How the contact form should send: a Cloudflare function on your own domain, or a form service key.

---

## Milestone 2 — visual direction (done, 16 November 2026)

Five directions were built as working mockups in `design/mockups/`, not pictures:

- **A Monograph, B Broadsheet, C Catalogue** — rejected as too editorial.
- **D Console** — rejected outright.
- **E Portfolio** — approved after three rounds of changes. The changes you asked for, all now in the
  built site: the headline is "I code. I build. I make impact." (from your logo tagline); your portrait
  appears in About only, head extracted and in a suit; the wording covers all sectors; projects show
  categories, languages, status, reason for building, technical complexity, charts and diagrams, and
  expand into a pop-up; CarHub is shown as three products in one; FloatBook, TaskFlow and FinanceFlow were
  added; skills were enlarged; the writing section is AsgatArticles; contact became real forms with
  WhatsApp and booking.

The mockups are kept in the repository as the record of the decision. They are not part of the built site.

---

## Milestone 1 — research (done, 11 November 2026)

Full read of all 40 public repositories, every demo link checked, and every claim traced to a README,
a build plan or the commit history. Written up in [milestone-1-research.md](milestone-1-research.md),
including the status mismatches found in some repository READMEs, which are yours to fix when you choose.
