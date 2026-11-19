# 0008 — Host on Vercel, and keep the contact logic host-independent

- Date: 19 November 2026
- Status: Accepted. Supersedes the hosting decision in [ADR 0002](0002-cloudflare-pages-hosting.md).

## Context

ADR 0002 chose Cloudflare Pages, and ADR 0007 wrote the contact form as a Pages Function in
`functions/api/contact.js`. The first real deploy showed two problems with that plan.

**The dashboard no longer leads there.** Cloudflare now steers new projects towards **Workers** rather
than **Pages**. The owner followed the guide, landed on the Workers flow, and ended up with a site at
`asgatcreation.asgatcreation.workers.dev` — the Workers naming scheme is
`<project>.<account>.workers.dev`, which doubles the name when the project and the account share one.
Worse, a Worker serving static assets does **not** read the `functions/` directory, so `/api/contact`
answered 404 on the live site and the form silently fell back to the visitor's mail app. The guide in
`DEPLOY.md` was written against the Pages screens and did not match what the owner actually saw.

**The owner did not want the result.** Asked directly, he chose Vercel.

## Decision

**Host on Vercel.** The site is static Astro, which Vercel deploys with zero configuration — no adapter,
no `vercel.json`, no output directory to set by hand.

**Move the contact logic out of any one host's format.** It now lives in `lib/contact.mjs`: plain
JavaScript, no dependencies, and no `Request` or `Response` in its signature. It takes the parsed body,
the settings and the visitor's IP, and returns `{ status, data }`.

Each host gets a thin wrapper that only unwraps the request and wraps the answer:

- `api/contact.js` — Vercel. `export async function POST(request)`, settings from `process.env`, IP from
  the first entry of `x-forwarded-for`.
- `functions/api/contact.js` — Cloudflare Pages, kept rather than deleted. `onRequestPost(context)`,
  settings from `context.env`, IP from `CF-Connecting-IP`.

Both are about thirty lines. The 17 tests in `tests/contact.test.mjs` cover the shared logic once and
then check each wrapper end to end.

## Consequences

Good: the address becomes `asgatcreation.vercel.app`, and the Vercel dashboard is one screen rather than
three. The form works on the first deploy with no extra dashboard work beyond the environment variables.
Moving host again is now one new wrapper file, not a rewrite — and because the Cloudflare wrapper stayed,
moving back is free.

Costs: Cloudflare's KV rate limit does not exist on Vercel, so `CONTACT_RATE` is never bound there and the
five-an-hour limit is simply off. The honeypot and Turnstile still run, and both are the defences that
actually matter against automated spam. If real abuse ever appears, Vercel's own rate limiting or an
Upstash KV binding would fill the gap, and the code path is already written.

Turnstile stays even though it is Cloudflare's: it is a public widget plus one API call, and it does not
care who hosts the page.

## What this does not decide

The visual design. The owner rejected the current look on seeing it live; that is being redone separately
and is independent of where the files are served from.
