# Milestone 1: Research

Written on 11 November 2026, from a full read of github.com/asgatcreation (40 public repos, all cloned and read)
and live checks of every demo link. Nothing here is built yet. This document needs your answers (§7) before
milestone 2.

---

## §1 What I found, in one paragraph

Your recent work (Sept–Nov 2026) is much stronger than your GitHub profile shows. The profile still lists
EduNexus and LiveBoard as current work, has no bio, location or website, and most repos have no description
or topics. The real story in the code is clear and rare: **you build systems that have to be correct**.
FloatBook runs on a double-entry ledger. Curavia has a hash-chained audit log and a query that crashes rather
than leak another hospital's data. OjaLive proves its bid engine with property-based tests. naija-data
gives a source for every record and runs 13,392 shared tests across three languages. Money is integer kobo
everywhere. Several READMEs have an "honest note". The portfolio should lead with that.

---

## §2 Inventory

Status checked against each repo's README, build plan and commit history. "Checked" = I loaded the URL today.

### Flagship and SaaS

| Project       | True status                                | Live / demo                                       | Stack (from the repo)                                                                          | Proof I can cite                                                                                                               |
| ------------- | ------------------------------------------ | ------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **CarHub**    | Live (portfolio project, demo data)        | carhub-es73.onrender.com, checked 200 (12 s wake) | Django 5.2, Channels, PostgreSQL/SQLite, Paystack, allauth, Leaflet/OSRM, PWA                  | 146 tests (README badge), CI on Python 3.12 + 3.13, 24 screenshots, 5 demo logins, row locking, HMAC webhook                   |
| **FloatBook** | Live demo                                  | floatbook.onrender.com, checked 200 (40 s wake)   | Laravel 13, PHP 8.5, Inertia 3, Vue 3, TypeScript, Tailwind 4, PostgreSQL 17, Pest, Playwright | Double-entry ledger, offline entry, Larastan level 7, CI; about 220 Pest tests by my count (confirm from CI)                   |
| **Curavia**   | In development, **milestone 6 of 15**      | none yet                                          | Django 6.1, DRF, Channels, Celery, React 19, PostgreSQL 18 (RLS), Redis                        | 4-layer tenant isolation, permissions matrix that generates tests, hash-chained audit log; about 620 backend tests by my count |
| **OjaLive**   | In development, **milestone 2 of 11**      | none yet                                          | TypeScript monorepo: Next.js 16, Fastify, Socket.IO, BullMQ, Redis Lua, PostgreSQL             | Design and ADRs written; load/race/chaos results arrive in milestones 10–11                                                    |
| **Scoreline** | In development (milestone unknown, see §7) | none yet                                          | Next.js 16, NestJS 12, Socket.IO, Prisma, PostgreSQL                                           | 10 commits, all on 9 Oct 2026; README says demo "coming soon"                                                                  |

**Status mismatches to fix in those repos (with your OK, later):** Curavia's README says "milestone 2 of 15"
but the build plan and commits show milestone 6. naija-pay's README says "no provider adapter is
sandbox-verified", but a 30 Oct commit says Paystack was sandbox-verified.

### Open source

| Project        | True status                                       | Links                                                                                                                                            | Proof                                                                                                                                                                                                          |
| -------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **naija-data** | Stable v1.0.0, published                          | PyPI `naija-data` 1.0.0, PyPI `django-naija` 1.0.0, npm `naija-data` 1.0.0, Go module; site and REST API on Cloudflare Workers, both checked 200 | 13,392 shared test cases; 37 states, 774 LGAs, 8,809 wards, 899 banks, each with a source; MIT code, CC BY 4.0 data; npm reported 532 downloads from 12 Oct to 10 Nov 2026 (can be fetched live at build time) |
| **naija-pay**  | Pre-release, **milestone 5 of 11**, not published | none yet                                                                                                                                         | Research on 25 providers, webhook-scheme table, Paystack adapter (sandbox-verified) and Flutterwave adapter in TypeScript and Python. MIT                                                                      |

### Data and research

| Project                                           | Status                            | Proof                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nigeria Economic & Labour Market Intelligence** | Pipeline complete, report written | 708 observations, 20 indicators, 36 states + FCT; findings report in `reports/`; Python, R, PostgreSQL, Docker; migration ledger and revision audit; 67 tests by my count. Headline findings (from your report): income per person peaked in 2015 and is 8.4% below it; 3.1% unemployment next to 66.5% vulnerable employment; manufacturing fell from 19.5% to 8.3% of GDP |

### Smaller live apps

| Project         | Status | Live                                                                    | Note                                                                                            |
| --------------- | ------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **TaskFlow**    | Live   | django-todo-app-8dio.onrender.com, checked 200 (34 s wake)              | Django 5, PostgreSQL. Commits are authored "AI Assistant"                                       |
| **FinanceFlow** | Live   | financeflow-app-uuu8.onrender.com, timed out at 70 s, then 200 on retry | Django 5, Supabase PostgreSQL, Google OAuth, 20 currencies. Commits are authored "AI Assistant" |

### Needs your decision (see §7)

| Repo                                                                                                      | What it is                                                                                                                 |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| CURRENCY-DERIVATIVES-UNDER-A-MINIMAL-MARKET-MODEL-WITH-RANDOM-SCALING                                     | M.Sc. thesis (University of Ibadan, 2022). The title page names **another student** as the author                          |
| IMPLIED-VOLATILITY-IN-THE-MINIMAL-MARKET-MODEL-for-…                                                      | M.Sc. thesis + Beamer slides (UI, 2023). **Another student** is named as the author                                        |
| oluchi799                                                                                                 | M.Sc. thesis + slides, stochastic fractional differential equations (UI, 2022). **Another student** is named as the author |
| LaTeX_Fiverr_Ecoreps                                                                                      | LaTeX job, apparently a Fiverr client (2020)                                                                               |
| LaTeX_work_Homogeneous_Grassmanian                                                                        | Maths note on homogeneous coordinates of the Grassmannian (2020). No author line. Yours?                                   |
| capstone-Group-12-Machine-Learning-Project                                                                | Group ML project on methane emissions (Nov 2022), 3 contributors                                                           |
| Asgat-Weather-Forecast-App                                                                                | Small weather app (July 2026), 1 commit, authored "AI Assistant"                                                           |
| aitalms, alivepolitiicsblog, studentportal, buyandselldjango, songcrudtask, songcrudproject, CarouselTask | Early Django / JS learning projects, 2022–2023. CarouselTask is live on Netlify (Zuri internship task)                     |
| EduNexus, LiveBoard                                                                                       | Listed in your profile README, not public                                                                                  |

### Recommend leaving out (and possibly archiving later, only if you agree)

- **Test repos:** test, testrun (empty), tte (empty), gittest, testng, finale, Assignments (empty README).
- **testSite:** a copy of a Netlify Gatsby demo. All 66 commits are by other people, so it should never appear as your work.
- **Forks:** material-dashboard, Auth_wiki-Team-Parrot, isiakaabd, waga43, LSTM-Neural-Network-for-Time-Series-Prediction, Imagecarousell-for-a-website, simple-flutter-contactlist.

---

## §3 Positioning: three headline options

All three can be backed by the repos above.

**A. Plain and searchable**

> Software engineer building fintech, real-time and data products for Nigeria.
>
> Sub-line: Full-stack engineering, data science and mathematics, in one person.

**B. The correctness angle** (my recommendation)

> I build software that has to be right: money, medicine and live data.
>
> Sub-line: Software engineer, data scientist and mathematician in Nigeria. Ledgers that balance, audit logs
> that can't be quietly edited, bid engines tested against race conditions.

**C. Maths-first**

> An engineer trained in mathematics, building fintech, health and real-time systems for Africa.
>
> Sub-line: Stochastic models in LaTeX, production systems in Django and TypeScript, and the tests that prove both.

Option B is the most memorable, and it is what your code actually shows. Option A is the safest for Google.
We can use B on the page and A in the page title and meta description, so you get both.
(Option C depends on question 3 in §7: what your own mathematics training is.)

**Who it's for:** startups, SMEs, fintechs, hospitals and schools, data and research teams, and employers
hiring remote or in Nigeria.
**Voice:** short sentences, no hype, every claim linked to a repo, a demo or a number from a README.

---

## §4 Proof strip (real numbers only)

Numbers that are fetched or counted at build time, never typed by hand:

- **Live products:** 5 (CarHub, FloatBook, TaskFlow, FinanceFlow, naija-data site + API).
- **Published packages:** 4 across 3 registries (naija-data on PyPI, npm and Go; django-naija on PyPI).
- **Shared test cases in naija-data:** 13,392 (from its README).
- **CarHub tests:** 146 (from its README).
- **npm downloads last month:** fetched from npm at build time.
- **Technologies used:** counted from the project files' `stack` fields.

I won't show my rough test counts for FloatBook, Curavia, naija-pay or OjaLive until you confirm them,
or until we can read them from each repo's CI.

---

## §5 Site map

| URL                                         | Page                                                                                                                                               |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                         | Home: hero, proof strip, selected work, capabilities, open source, data & research, how I work, latest writing, currently building, call to action |
| `/work/`                                    | All projects, filter by type and technology, sort                                                                                                  |
| `/work/<slug>/`                             | Case study                                                                                                                                         |
| `/open-source/`                             | Packages, install commands, release status, how to contribute                                                                                      |
| `/research/`                                | Data & Research, with interactive charts                                                                                                           |
| `/lab/`                                     | Mini tools: NUBAN validator, naija-data search, Brownian-motion visualiser                                                                         |
| `/services/`                                | What I offer, ways to work together, process, FAQs                                                                                                 |
| `/about/`                                   | Story, experience, education, skills                                                                                                               |
| `/now/`                                     | What I'm working on this month                                                                                                                     |
| `/writing/` and `/writing/<slug>/`          | Articles, tags, series, RSS at `/rss.xml`                                                                                                          |
| `/cv/` and `/cv.pdf`                        | HTML and PDF CV from the same data                                                                                                                 |
| `/contact/`                                 | Enquiry form, WhatsApp, email, booking                                                                                                             |
| `/uses/`, `/colophon/`, `/privacy/`, `/404` | Supporting pages                                                                                                                                   |

Testimonials stay hidden until real ones exist. Placeholders like `[[ADD: ...]]` fail the build.

**Featured on the home page (proposal):** CarHub, FloatBook, naija-data, Curavia (in development),
Nigeria Economic Intelligence, OjaLive (in development).

---

## §6 Content schemas, hosting and services

### Content (all validated with zod at build time)

- `content/profile.yaml`: one file about you. It feeds About, CV, footer, JSON-LD and the LinkedIn profile kit.
- `content/projects/<slug>.mdx`: one file per project. Front-matter: `title`, `tagline`, `status`
  (`live | in-development | pre-release | open-source | archive`), `milestone` (`{ current, total }`,
  required when in development), `types[]`, `stack[]`, `year`, `role`, `timeline`, `repo`, `demo`
  (`{ url, host, wakes }`; `wakes: true` shows "may take ~30 s to wake"), `demoLogins[]`, `tests`
  (`{ count, source }`, where the source must be a link), `featured`, `order`, `cover` images (light and dark).
- `content/writing/<slug>.mdx`: `title`, `description`, `date`, `updated`, `tags[]`, `series`, `draft`.
- `content/now.md`, `content/uses.md`: plain Markdown with a date.

### Hosting: Cloudflare (recommended) vs Vercel

|                       | Cloudflare                      | Vercel                                                                                  |
| --------------------- | ------------------------------- | --------------------------------------------------------------------------------------- |
| Cost for this site    | Free                            | Free, but the Hobby plan is for non-commercial use, so client enquiries are a grey area |
| Speed in Nigeria      | Cloudflare has a Lagos edge     | No Nigerian edge                                                                        |
| Contact form function | Included                        | Included                                                                                |
| You already use it    | Yes, naija-data runs on Workers | No                                                                                      |

**Recommendation: Cloudflare.** It's free, has a Lagos edge, and you already have an account. The site is
built and deployed by GitHub Actions, which also runs the daily rebuild. Pull requests get preview links.
In milestone 3 I'll check Cloudflare's current advice on Pages vs Workers static assets and record the
choice in an ADR.

- **Form:** a Cloudflare function that checks the input, Turnstile and a honeypot, and a rate limit, then
  sends through Brevo's HTTP API (you already use Brevo in CarHub and FloatBook), plus an auto-reply.
- **Analytics:** Cloudflare Web Analytics. Free, no cookies, no banner.
- **GitHub data:** fetched at build time and cached. Without a token, GitHub allows 60 calls an hour, which
  ran out during this research, so we'll use a read-only token stored as a secret.
- **Domain:** until you buy one, the site lives on a free Cloudflare address.

Exact package versions are chosen and pinned in milestone 3, and I'll list them for you then.

---

## §7 Questions for you

1. ~~**Headline:** A, B or C?~~ **Decided 11 Nov 2026: B** ("I build software that has to be right: money,
   medicine and live data."), with A's wording used in the page title and meta description for search.
2. **The three University of Ibadan M.Sc. theses** (currency derivatives, implied volatility, stochastic
   fractional equations): what was your role? Typesetting, research support, or something else? My
   suggestion is one line on the Research page, "LaTeX typesetting and research support for M.Sc. theses
   in financial mathematics", with no student names, if that's accurate. **Is the Grassmannian note your
   own work?** And is Ecoreps a Fiverr client job I can describe without the client's name?
3. **Your own education:** which degrees, where and when? I won't assume anything from these repos.
4. **EduNexus and LiveBoard:** show them as private or client work (you'd send screenshots), or leave them out?
5. **Capstone ML project** (methane emissions, Group 12, 3 contributors): show it in the Archive with your
   role stated, or leave it out?
6. **Weather app and early learning projects:** a small Archive section at the bottom of `/work/`, or leave them out?
7. **Scoreline:** which milestone is it on, out of how many? It has had no commits since 9 October.
8. **Statuses:** can I use "Curavia: milestone 6 of 15" and "naija-pay: milestone 5 of 11"? Please also
   confirm the test counts for FloatBook, Curavia and naija-pay, or let me take them from CI.
9. **Commits authored "AI Assistant"** in TaskFlow, FinanceFlow and the weather app: leave them as they are,
   or fix them later? Fixing them rewrites history, which can't be undone, so I'll only do it if you say so.
   The portfolio repo will commit under your own name and email.
10. **Work history:** any paid client work, jobs or employers I should list? Or should I wait for your CV?
11. **Domain:** are you planning to buy one (for example asgatcreation.com)? It affects SEO and email.
12. **Contact details for the site:** a WhatsApp number, and do you have Cal.com yet? This can wait until milestone 9.

When you answer, I'll start milestone 2: three visual directions as real mockups.
