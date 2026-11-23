# Progress

Where the portfolio stands, newest first. Updated 23 November 2026.

| Milestone | What it covers                                                                   | Status                  |
| --------- | -------------------------------------------------------------------------------- | ----------------------- |
| 1         | Research: every repo read, every demo link checked                               | Done — 11 November 2026 |
| 2         | Visual direction: mockups, chosen and refined                                    | Done — 16 November 2026 |
| 3         | The real site: Astro build of the approved direction                             | Done — 17 November 2026 |
| 4         | Remaining pages: about, services, now, writing, cv, lab, research, uses, privacy | Done — 17 November 2026 |
| 5         | Contact form that really sends (host function, spam check)                       | Done — 17 November 2026 |
| 6         | Search over projects and AsgatArticles                                           | Not started             |
| 7         | Social preview images, metadata and structured data                              | Done — 23 November 2026 |
| 8         | First AsgatArticles posts                                                        | Not started             |
| 9         | Online booking                                                                   | Not started             |
| 10        | Privacy-friendly analytics                                                       | Not started             |
| 11        | Checks in CI: Lighthouse budgets, browser tests, spelling                        | Not started             |
| 12        | Accessibility and performance pass on real devices                               | Not started             |
| 13        | Domain, deploy and launch                                                        | Not started             |

---

## Milestone 7 — how the site looks when it is shared (done, 23 November 2026)

**Every link to this site previewed as a blank grey box.** There was no `og:image` anywhere, and no
Twitter card tag, so a link pasted into WhatsApp, LinkedIn or X showed a bare URL. For a portfolio, which
exists to be sent to people, that is the worst place to be plain.

**Twelve social cards were built** — one for the site and one for each published case study — at
`public/og/`, 1200x630, in the same black and gold as the site, each carrying your logo, the project's own
title, its own tagline, its real status and the first two items of its real stack. Nothing on a card is
written by hand: every word is read out of that project's JSON file or out of `src/data/site.ts`, so a
card can never claim something the case study does not.

They are **generated once and committed**, by `npm run og`. Building them during the deploy would make
every deploy depend on the image library and on which fonts the build machine happens to have installed.
A committed PNG looks the same everywhere, forever. Re-run `npm run og` after changing a project's title,
tagline, status or stack.

**The tags that make the card appear** were added to the shared page layout: `og:image` with its width,
height and alt text, `og:url`, `og:site_name`, `og:locale`, `twitter:card`, `twitter:title`,
`twitter:description`, `twitter:image` and `twitter:creator`.

**Structured data** was added too: a `Person` record on every page (your name, the brand, what you do,
Oyo in Nigeria, and your GitHub, LinkedIn and X profiles) and a `CreativeWork` record on every case study
(title, tagline, summary, year, categories, languages, and the live demo and repository where they exist).
This is what lets Google show you as a person rather than as a string of words. Your email address is
deliberately not in it.

**A guard was added** so this cannot quietly rot: the build now fails if a page points at a social card
that does not exist, and tells you to run `npm run og`. CI now builds with `SITE_URL` set so that check,
the canonical URLs and the sitemap are all exercised on every push.

**Checked:** `npm run verify` clean. The built HTML was read back: all 23 pages carry the card and the
`Person` record, all 11 case studies carry their own card and `CreativeWork` record, every JSON-LD block
parses, all 12 cards resolve, none is unused, and the guard was proved by deleting a card and watching
the build fail. Pages re-checked in a browser at 360, 768 and 1440px with no overflow and no console
errors.

**One thing to know:** the cards only appear once `SITE_URL` is set, because social networks need the
full `https://...` address of the image. That variable is part 1 of [DEPLOY.md](DEPLOY.md). Until the site
is deployed, there is nothing for WhatsApp to fetch.

---

## The writing on the case studies (23 November 2026)

**Every case study was printing its problem twice.** The page shows "Why I built it" and then "The
problem:" directly beneath it, and every `why` paragraph opened by restating the problem. FloatBook's two
paragraphs were 76% identical, measured with `difflib`. The fix was to give the two fields different jobs:
`problem` is what is wrong in the world, `why` is the motivation and what the project set out to prove.
Eight fields were rewritten on that basis.

| Project     | Overlap before | After |
| ----------- | -------------- | ----- |
| FloatBook   | 76%            | 32%   |
| naija-pay   | 64%            | 26%   |
| FinanceFlow | 62%            | 35%   |
| NEI         | 58%            | 19%   |
| Oja Live    | 57%            | 28%   |
| CarHub      | 46%            | 8%    |
| TaskFlow    | 46%            | 15%   |

No new facts were added. Every fact in the new text already appeared in that project's own copy. Two
changes were purely subtractive: NEI's problem had a solution sentence tacked onto it, and TaskFlow's
"problem" read "A simple product done properly", which is an intention rather than a problem.

**The hardest part was moved to the top.** The strongest writing on each case study is its first
technical-complexity entry — CarHub's "Two buyers, one car", FloatBook's "A ledger that always balances",
naija-pay's "Whole kobo only". It sat in section 06, where few readers reach. It now appears as a callout
directly under the Year / Sector / Status strip, and the Technical complexity section shows the remaining
entries, numbered from 02 so nothing is repeated and the count still adds up. Auth Wiki has no entries, so
it gets no callout.

**Two taglines were replaced** because they would have fitted any product in their category:

| Project   | Was                                  | Now                                              |
| --------- | ------------------------------------ | ------------------------------------------------ |
| TaskFlow  | Manage your day, one task at a time. | A to-do app that doesn't stop at the happy path. |
| Scoreline | Real-time football live scores.      | One goal event, every viewer, no refresh.        |

Both are drawn from text already on those pages — TaskFlow's own stated problem, and Scoreline's fan-out
entry.

**Checked:** `npm run verify` clean — 0 errors, 17 tests, 23 pages, no placeholders. All 11 published case
studies read back in a browser at 360, 768 and 1440px: no horizontal overflow, no console errors, section
numbering continuous on every page.

**Still weak:** EduNexus has 59% overlap, but it is `draft: true` and full of `[[ADD]]` placeholders, so it
is not published and needs your content before it is worth editing.

---

## Hosting changed to Vercel (19 November 2026)

The first deploy went out on Cloudflare as a **Worker** rather than a **Pages** project, because that is
what the current Cloudflare dashboard steers you to. Two things went wrong:

- the address came out as `asgatcreation.asgatcreation.workers.dev` (Workers name a site
  `<project>.<account>.workers.dev`, which doubles up when both are `asgatcreation`);
- a Worker does not read the `functions/` folder, so `/api/contact` answered **404** on the live site and
  the contact form quietly fell back to opening the visitor's mail app.

Asked where he would rather be, the owner chose **Vercel**. So:

- the contact logic moved to `lib/contact.mjs` — plain JavaScript, no dependencies, and no host-specific
  types in its signature;
- `api/contact.js` (Vercel) and `functions/api/contact.js` (Cloudflare Pages) are now thin wrappers of
  about thirty lines each. Cloudflare's was kept, not deleted, so moving back costs nothing;
- the tests grew from 15 to 17: the shared logic is checked once, then each wrapper end to end;
- `docs/DEPLOY.md` was rewritten for Vercel. It is shorter — Vercel detects Astro and needs no build
  settings at all;
- written up in [ADR 0008](adr/0008-host-on-vercel.md), which supersedes [ADR 0002](adr/0002-cloudflare-pages-hosting.md).

**Checked:** `npm run verify` clean — 17 tests passing, 23 pages built, no placeholders.
**Not yet proved:** the live deploy on Vercel. That is part 1 of [DEPLOY.md](DEPLOY.md), and it is yours
to click.

## Case studies, and a stats policy (20 November 2026)

**Case studies open on the work.** Each one used to begin with paragraphs; the reader scrolled a long way
before seeing anything built. Now:

- the four projects with screenshots (CarHub, FloatBook, FinanceFlow, TaskFlow) open with a real screen in
  a browser frame showing the real address — the same frame the home page uses, so the site has one device
  for showing work rather than three;
- the six with no screenshots open with their architecture diagram instead. It was already drawn and
  already theirs; it was just buried five sections down. Where it is promoted, the later Architecture
  section is suppressed so nothing is drawn twice;
- every case study gained a Year / Sector / Status / Built-with strip under the opener.

Only Auth Wiki still opens on text: it has no screenshots and no diagram.

**Stats: only real ones, even if that means none.** Seven headline figures were configuration trivia
rather than achievements, and were removed — not reworded, not replaced:

| Project     | Removed                                                   |
| ----------- | --------------------------------------------------------- |
| CarHub      | `2 Python versions in CI`                                 |
| FinanceFlow | `5 currencies per user`, `15 starter categories`          |
| FloatBook   | `1 Docker container`                                      |
| TaskFlow    | `3 priority levels`, `4 search filters`, `1 click deploy` |

Kept because they are real signals: CarHub's 146 automated tests; FloatBook's L7 Larastan level and 72h
reversal target; naija-data's 13,392 shared test cases, 8,809 wards and 532 npm downloads — outside
validation, and the strongest number on the site; NEI's 898 observations across 37 states and 35 years.

**TaskFlow, Scoreline and Auth Wiki now show no stat bar at all.** The owner was asked for real numbers and
chose to leave them blank. That is the standing decision: a portfolio that shows figures only where it has
them reads as more trustworthy than one that pads every project. The spec strip carries those pages
instead, so they do not look unfinished.

**Still outstanding:** the owner's role on Auth Wiki, unanswered since milestone 3. Nothing is written
about his contribution until he says.

## The look was rebuilt from the logo (19 November 2026)

Seeing the site live, the owner rejected the look — the colours, the motion, the typography and the
direction as a whole. Three replacement directions were built (F Studio, G Swiss, H Desk) and rejected
too. Four misses meant the brief was wrong, not the execution, so he was asked directly. His answer:
**his logo's colour.**

Two things came out of that:

- **The site was already black and gold — in dark mode.** What he had been looking at was the **light**
  theme, `#faf7f1`, a cream paper colour. The gold was never the problem; the cream under it was. Dropping
  gold from F, G and H had been a correction in the wrong direction.
- **Nothing had been built from the actual logo.** Sampling `public/img/logo-avatar.jpg` gives true black
  `#000000`, a metallic gold running `#7c4c03 → #c78212 → #f2c24f`, and silver `#d5d5d5`.

**What changed**

- One theme only. The light tokens, the toggle, the stored `theme` choice and the palette's theme action
  are gone, and any choice stored by the old site is deleted on first visit.
- The palette now comes from the logo, with silver body text in place of the old warm cream.
- Typefaces: Syne and Manrope → **Outfit** and **Inter**. JetBrains Mono stays for code.
- Removed, all of them named in the rejection: the hollow outlined "I build.", the particle constellation
  behind the hero, the typing effect that cycled eight phrases, the preloader with its fake percentage,
  and the custom gold cursor. The footer's giant outlined word became a dim solid watermark.
- The privacy page was corrected: it said a theme choice is stored, which is no longer true.
- Turnstile is set to its dark widget so it matches the page.
- Written up in [ADR 0009](adr/0009-one-theme-from-the-logo.md). The full direction is at
  `design/mockups/i-obsidian/`; F, G and H stay as the record of how this was reached.

**Checked**

- `npm run verify` clean: 0 errors, 0 warnings, Prettier passing, 17 tests, 23 pages, no placeholders.
- 13 pages × 3 widths (375, 768, 1280) driven in a real browser: no sideways scroll anywhere, and every
  page renders on true black. No console errors.

**Not yet decided:** whether the owner is happy with it. He has not seen the rebuilt site itself yet,
only the Obsidian mockup it came from.

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

---

## Milestone 4 — the nine standing pages (done, 17 November 2026)

Everything the home page summarises now has a full page behind it.

**What was built**

| Page         | What is on it                                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `/about/`    | The long version: portrait, the two working lives, full experience, education, certificates, CV downloads                        |
| `/services/` | The eight kinds of work, with what each one actually includes; ways to work together; how a project runs; six common questions   |
| `/now/`      | What is in progress this month, what is simply running, and that I am open to work. Dated, and kept by hand                      |
| `/writing/`  | AsgatArticles: the six articles being written, by topic. Honest that none is published yet                                       |
| `/cv/`       | The CV as a web page — profile, key skills, experience, education, selected projects — plus the five PDFs                        |
| `/research/` | The economic findings with charts, the naija-data datasets, the national surveys, and the two dissertations                      |
| `/lab/`      | Three small tools that run in the page: a NUBAN account checker, a float-versus-kobo demonstration, and a Brownian-motion canvas |
| `/uses/`     | 43 tools in eight groups, each with the project that uses it, and how they are chosen                                            |
| `/privacy/`  | A plain account: no cookies, no analytics, what the three outside requests are, and what the forms do                            |

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
