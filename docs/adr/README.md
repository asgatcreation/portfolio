# Architecture decision records

One file per decision, numbered in order. Each one says what was decided, why, and what it costs.
A decision is never edited away: if it changes later, a new ADR supersedes the old one and both stay.

| #                                                | Decision                                                              | Status             |
| ------------------------------------------------ | --------------------------------------------------------------------- | ------------------ |
| [0001](0001-static-astro-site.md)                | Build the site as a static Astro site                                 | Accepted           |
| [0002](0002-cloudflare-pages-hosting.md)         | Host on Cloudflare Pages                                              | Superseded by 0008 |
| [0003](0003-projects-as-json-collections.md)     | Keep project content as JSON checked by zod                           | Accepted           |
| [0004](0004-pin-typescript-6.md)                 | Pin TypeScript to 6.x                                                 | Accepted           |
| [0005](0005-vanilla-javascript.md)               | Write the interactions in plain JavaScript, no framework              | Accepted           |
| [0006](0006-placeholder-build-gate.md)           | Fail the build on any `[[ADD: ...]]` placeholder                      | Accepted           |
| [0007](0007-contact-function-brevo-turnstile.md) | Send the contact form with a Cloudflare function, Brevo and Turnstile | Accepted           |
| [0008](0008-host-on-vercel.md)                   | Host on Vercel, with the contact logic kept host-independent          | Accepted           |
