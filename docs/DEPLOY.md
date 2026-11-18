# Putting the site live on Cloudflare

Written for you to follow click by click. Everything here is free. You do all of it in your own
accounts — I never see or hold any key.

Checked against Cloudflare's and Brevo's documentation on 18 November 2026. If a button has been
renamed since, the nearby wording should still make it obvious; tell me and I will re-check.

**Order:** part 1 puts the site online (15 minutes). Parts 2 and 3 make the contact form send
(20 minutes). Part 4 is your own domain, whenever you buy one.

---

## Part 1 — Deploy the site

1. Sign in at <https://dash.cloudflare.com>. Create a free account if you do not have one.
2. In the sidebar choose **Workers & Pages**.
3. Select **Create application** → the **Pages** tab → **Connect to Git**.
4. Choose **GitHub** and authorise Cloudflare. On GitHub's screen you can give access to **only
   select repositories** — pick `asgatcreation/portfolio`. That is enough.
5. Back in Cloudflare, select the `portfolio` repository and press **Begin setup**.
6. Fill in the build settings exactly:

   | Field                  | Value                                                               |
   | ---------------------- | ------------------------------------------------------------------- |
   | Project name           | `asgatcreation` (this becomes `asgatcreation.pages.dev`)            |
   | Production branch      | `main`                                                              |
   | Framework preset       | **Astro** (or leave as None — the two fields below are what matter) |
   | Build command          | `npm run build`                                                     |
   | Build output directory | `dist`                                                              |
   | Root directory         | leave empty                                                         |

   The project name is the address, and these names are shared by everyone on Cloudflare. I checked on
   18 November 2026: `asgatcreation` was free, while plain `portfolio` is already taken by someone else.
   If Cloudflare says the name is in use, try `asgat` or `asgatcreation-site` and tell me which you
   picked, so the rest of the settings match.

7. Open **Environment variables (advanced)** and add one for now:

   | Name           | Value |
   | -------------- | ----- |
   | `NODE_VERSION` | `24`  |

8. Press **Save and Deploy**. The build takes two or three minutes. When it finishes you get a link
   like `https://asgatcreation.pages.dev` — that is your site, live.

From now on, every push to `main` deploys itself. Pull requests get their own preview link.

**If the build fails,** open the build log and send me the last twenty lines. The same commands run in
GitHub Actions on every push, so a failure here is almost always a setting on this screen, not the code.

---

## Part 2 — Brevo, so the form can send email

Brevo's free tier allows 300 emails a day. The contact form will never come close.

1. Sign up at <https://www.brevo.com> with your own email address.
2. Brevo asks what you want to do — choose the transactional email / developer option. If it asks for a
   company name, `asgatcreation` is fine.
3. **Register a sender.** Go to **Senders, Domains & Dedicated IPs** → **Senders** → **Add a sender**.
   - Until you own a domain, use your own Gmail address as the sender. Brevo emails you a code to
     confirm it. (Email from a Gmail sender address can land in spam more often; once you own
     `asgatcreation.com`, add the domain in the **Domains** tab and follow Brevo's DNS records instead.
     That is the proper fix, and it is free.)
4. **Create the API key.** Click your name (top right) → **SMTP & API** → the **API keys** tab →
   **Generate a new API key**. Name it `portfolio-site`.
5. **Copy the key now** — Brevo shows it once. Do not paste it into a chat, an email, or this repository.
   Put it straight into Cloudflare in part 4 below. If it ever leaks, delete it on this screen and make a
   new one.

---

## Part 3 — Turnstile, the spam check (recommended)

Turnstile is Cloudflare's alternative to a CAPTCHA. It sets no cookies, tracks nobody, and usually shows
your visitor nothing at all.

1. In the Cloudflare dashboard sidebar, choose **Turnstile**.
2. Select **Add widget**.
   - **Widget name:** `portfolio contact form`
   - **Hostnames:** `asgatcreation.pages.dev`, plus your own domain when you have one. Add `localhost` as
     well if you want the widget to appear while testing on your own machine.
   - **Widget mode:** **Managed** (Cloudflare decides when to challenge).
   - **Region:** choose the one nearest you. **This cannot be changed later.**
3. Press **Create**. You now see two keys:
   - **Site key** — public, it goes in the page.
   - **Secret key** — private, it goes in Cloudflare only.

Skipping this part is fine: without it the honeypot and the rate limit still work, and nothing breaks.

---

## Part 4 — Tell the site about the keys

In **Workers & Pages** → your `asgatcreation` project → **Settings**.

**Variables and secrets** (these are read by the contact function, at run time). Add each one for the
**Production** environment, and mark the two keys as **Secret** rather than plain text:

| Name                   | Value                                         | Type       |
| ---------------------- | --------------------------------------------- | ---------- |
| `BREVO_API_KEY`        | the key from part 2                           | Secret     |
| `CONTACT_TO`           | the address where you want messages to arrive | Secret     |
| `CONTACT_FROM`         | the sender address you verified in Brevo      | Plain text |
| `TURNSTILE_SECRET_KEY` | the secret key from part 3                    | Secret     |

**Build variables** (read while the site is being built). Add under the build settings, next to
`NODE_VERSION`:

| Name                        | Value                                                               |
| --------------------------- | ------------------------------------------------------------------- |
| `PUBLIC_TURNSTILE_SITE_KEY` | the site key from part 3                                            |
| `SITE_URL`                  | `https://asgatcreation.pages.dev`, or your domain once you have one |

Then **Deployments** → the latest one → **Retry deployment**, so the new build picks up the build
variables.

**Optional — the rate limit.** It only switches on if you give it somewhere to count:
**Storage & Databases** → **KV** → **Create a namespace** called `contact-rate`. Then in your Pages
project, **Settings** → **Bindings** → **Add** → **KV namespace**, with variable name `CONTACT_RATE`,
pointing at that namespace. Redeploy. Each visitor IP is then limited to five messages an hour.

### Check that it works

1. Open your site, go to **Contact**, and send yourself a real message.
2. You should get it at `CONTACT_TO` within a minute, and pressing reply should reply to _you_ (the
   function sets the sender as reply-to).
3. The visitor — you, in this test — should also get the automatic "I have your message" email. To turn
   that off, add `CONTACT_AUTOREPLY` = `off`.
4. If nothing arrives: check the Brevo **Logs** page first (it shows rejected sends and why), then
   Cloudflare's **Workers & Pages** → your project → the deployment's **Functions** logs.
5. While none of this is set up, the form falls back to opening your visitor's own mail app. Nothing is
   ever lost.

---

## Part 5 — Your own domain, when you buy one

`asgatcreation.pages.dev` works forever and costs nothing, so this can wait. When you do buy one,
nothing breaks: the pages.dev address keeps working alongside it.

1. Buy the domain. Cloudflare Registrar sells at cost, which keeps everything in one place.
   Checked on 18 November 2026, `asgatcreation.dev`, `asgatcreation.com` and `asgatcreation.app` were
   all unregistered. `.dev` is a normal domain anyone can buy, and it is on the browsers' HTTPS-only
   list — every visit must use HTTPS, which this site does anyway, so there is nothing extra to do.
2. Add the domain to Cloudflare: **Account Home** → **Add a domain**, then follow the nameserver
   instructions from your registrar.
3. In your Pages project: **Custom domains** → **Set up a domain** → type the domain. Cloudflare creates
   the DNS record and the HTTPS certificate for you.
4. Afterwards, update two things so links and email stay right:
   - the `SITE_URL` build variable → your new address, then redeploy (this switches on the sitemap);
   - the Turnstile widget's hostname list → add the new domain;
   - and in Brevo, add the domain under **Domains** so email comes from `hello@yourdomain` rather than
     Gmail.

---

## What this costs

Nothing, at this size: Cloudflare Pages, Turnstile and KV are free, and Brevo's free tier is 300 emails a
day. A domain is the only real cost, roughly $10 a year. Nothing here asks for a card.
