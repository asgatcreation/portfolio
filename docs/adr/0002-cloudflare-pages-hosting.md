# 0002 — Host on Cloudflare Pages

- Date: 17 November 2026
- Status: Accepted

## Context

The built site is static files (ADR 0001). It needs a host that is free at this size, fast from Nigeria,
gives HTTPS on a custom domain, and can later run one small function for the contact form.

Options considered:

1. **Cloudflare Pages.** Free static hosting, a large network including African points of presence,
   free HTTPS, Pages Functions for the contact form, and Turnstile for spam without tracking visitors.
2. **GitHub Pages.** Free and simple, but no server-side anything, so the contact form would always
   need a third party.
3. **Netlify or Vercel.** Both fine; their free tiers are tighter and their networks are weaker in
   West Africa.
4. **Render.** Already used for the project demos, but slow cold starts on the free tier.

## Decision

Cloudflare Pages, building from the GitHub repository with `npm ci && npm run build` and publishing `dist`.
`SITE_URL` is set as a build variable so the sitemap and canonical links use the real domain.

## Consequences

Good: no server to maintain, free, fast locally, and the contact form can become a Pages Function on the
same domain later (milestone 5) with no extra service and no e-mail address exposed in the page.

Costs: the deploy is tied to one vendor's dashboard settings, which live outside the repository. The build
command and variables are therefore written down in `docs/PROGRESS.md` so they can be rebuilt from scratch.
Moving host later means re-creating redirects and the function, but nothing in `src/` would change.
