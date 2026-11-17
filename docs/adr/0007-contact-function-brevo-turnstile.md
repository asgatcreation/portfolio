# 0007 — Send the contact form with a Cloudflare function, Brevo and Turnstile

- Date: 17 November 2026
- Status: Accepted

## Context

The site is static (ADR 0001), so until now the message and booking forms could only hand the visitor's
own mail app or WhatsApp a message already written. That works, and it never loses a message, but it asks
the visitor to do the last step themselves, and on a phone with no mail app set up it goes nowhere.

A contact form that really sends needs something server-side. The options:

1. **A Cloudflare Pages Function on the same domain**, calling an e-mail API.
2. **A form service** (Web3Forms, Formspree and the like). A key in the page, a third party holding the
   messages, and the owner's e-mail address sitting in someone else's dashboard.
3. **SMTP from the browser.** Not possible, and any "solution" means putting credentials in the page.

Whatever sends it must not put the owner's e-mail address in the page source for scrapers, must survive
being deployed to a host with no functions, and must not use cookies or a tracker.

## Decision

A Pages Function at `functions/api/contact.js`, deployed with the site and answering `POST /api/contact`.
It is a plain JavaScript module with no dependencies.

- **Validation first.** Fields are trimmed, stripped of control characters and cut to length; the name,
  address and message are checked. Anything invalid is a 400 with a sentence the visitor can act on.
- **A honeypot field** (`company`), off-screen and `tabindex="-1"`. If it is filled, the function answers
  200 and sends nothing, so a bot gets no signal.
- **Cloudflare Turnstile**, which needs no cookies and usually shows nothing. It is optional at both ends:
  the widget appears only when `PUBLIC_TURNSTILE_SITE_KEY` is set at build time, and the function demands
  a valid token only when `TURNSTILE_SECRET_KEY` is set.
- **An optional rate limit** of five messages an hour per IP, used only when a KV namespace is bound as
  `CONTACT_RATE`. A storage failure never blocks a real message.
- **Brevo's HTTP API** sends the mail, because it is already used in CarHub and FloatBook. The message goes
  to `CONTACT_TO` with the visitor as `replyTo`, so replying is one click. The visitor gets an
  acknowledgement unless `CONTACT_AUTOREPLY=off`.
- **Every secret is an environment variable** in the Cloudflare dashboard. None is in the repository, and
  the owner's address never appears in the function's source.

The page falls back rather than failing: on 503, 404, 405 or a network error it opens the visitor's mail
app with the message already written, exactly as before. On a 400 or 429 it shows what the function said,
because that is something the visitor can fix.

## Consequences

Good: a visitor can now send a message without leaving the page, the form works on hosts with no function
at all, and the spam defences cost the visitor nothing. The function has no dependencies, so there is
nothing to keep updated, and 15 tests (`npm test`, run in CI) cover validation, the honeypot, escaping,
Turnstile, the rate limit and both failure paths.

Costs: the full path can only be proved once the site is deployed and the accounts exist — the tests prove
the logic, not Brevo's delivery. It also ties the form to Cloudflare Pages; moving host would mean porting
one file to that host's function format. Brevo's free tier has a daily limit, which is far above what a
portfolio contact form will ever use but is worth knowing.
