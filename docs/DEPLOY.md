# Putting the site live on Vercel

Written for you to follow click by click. Everything here is free. You do all of it in your own
accounts — I never see or hold any key.

**Order:** part 1 puts the site online (5 minutes). Parts 2 and 3 make the contact form send
(20 minutes). Part 5 is your own domain, whenever you buy one.

> **If you already made the Cloudflare Worker**, leave it for now; it does no harm. Once Vercel is live
> and you are happy, delete it in the Cloudflare dashboard under **Workers & Pages** → the project →
> **Settings** → **Delete**. Tell me when you want to, and I will walk you through it.

---

## Part 1 — Deploy the site

1. Go to <https://vercel.com> and press **Sign Up**. Choose **Continue with GitHub** — that way Vercel can
   see your repositories straight away and there is no second account to remember.
2. Vercel asks for a name for your team or account. **`asgatcreation`** is fine, and it is free
   (the Hobby plan).
3. On the dashboard press **Add New…** → **Project**.
4. You see a list of your GitHub repositories. Find **`portfolio`** and press **Import**.
   - If it is not listed, press **Adjust GitHub App Permissions**, pick **Only select repositories**, add
     `asgatcreation/portfolio`, and save. The list refreshes.
5. Vercel now shows the project settings. It should have already detected **Astro** as the framework, and
   filled in the build command and the output directory by itself. **Do not change anything** — every
   field is already right:

   | Field            | What it should say               |
   | ---------------- | -------------------------------- |
   | Framework Preset | **Astro**                        |
   | Build Command    | `astro build` or `npm run build` |
   | Output Directory | `dist`                           |
   | Install Command  | `npm install`                    |
   | Root Directory   | `./`                             |

   If the Framework Preset says **Other** instead of Astro, set it to **Astro** yourself and the rest
   fills in.

6. Open **Environment Variables** and add one for now:

   | Name       | Value                              |
   | ---------- | ---------------------------------- |
   | `SITE_URL` | `https://asgatcreation.vercel.app` |

7. Press **Deploy**. It takes about a minute. When it finishes you get confetti and a link — that is your
   site, live.

**About the address.** Vercel names it after the project, so you should get
`https://asgatcreation.vercel.app`. Project names are shared across all of Vercel, so if `asgatcreation`
is taken you will be offered something like `asgatcreation-xyz`. Whatever you end up with, **send me the
real address** and I will correct `SITE_URL` and the Turnstile settings to match.

**You get more than one link.** Vercel always gives a project a permanent address and also a unique
address per deploy. The short one above is the one to share.

From now on, every push to `main` deploys itself, and every pull request gets its own preview link.

**If the build fails,** open the build log and send me the last twenty lines. The same commands run in
GitHub Actions on every push, so a failure here is almost always a setting on this screen, not the code.

### Check the form is really there

Open `https://asgatcreation.vercel.app/api/contact` in your browser. You should see:

```json
{ "error": "Use POST." }
```

That is correct and means the function is running. (A **404** would mean it is not — tell me if you see
one.) It will say "Sending is not set up on this site yet" until you finish part 4; until then the form
falls back to opening the visitor's mail app, exactly as it does today, so nothing is ever lost.

---

## Part 2 — Brevo, so the form can send email

Brevo's free tier allows 300 emails a day. The contact form will never come close.

1. Sign up at <https://www.brevo.com> with your own email address.
2. Brevo asks what you want to do — choose the transactional email / developer option. If it asks for a
   company name, `asgatcreation` is fine.
3. **Register a sender.** Go to **Senders, Domains & Dedicated IPs** → **Senders** → **Add a sender**.
   - Until you own a domain, use your own Gmail address as the sender. Brevo emails you a code to
     confirm it. (Email from a Gmail sender address can land in spam more often; once you own a domain,
     add it in the **Domains** tab and follow Brevo's DNS records instead. That is the proper fix, and it
     is free.)
4. **Create the API key.** Click your name (top right) → **SMTP & API** → the **API keys** tab →
   **Generate a new API key**. Name it `portfolio-site`.
5. **Copy the key now** — Brevo shows it once. Do not paste it into a chat, an email, or this repository.
   Put it straight into Vercel in part 4 below. If it ever leaks, delete it on this screen and make a
   new one.

---

## Part 3 — Turnstile, the spam check (recommended)

Turnstile is Cloudflare's alternative to a CAPTCHA. It sets no cookies, tracks nobody, and usually shows
your visitor nothing at all. It is a free Cloudflare account and it works perfectly well on a site hosted
by Vercel — it is just a small widget in the page plus one check on the server.

1. Sign in at <https://dash.cloudflare.com> (a free account is enough; you do not need a domain there).
2. In the sidebar, choose **Turnstile**, then **Add widget**.
   - **Widget name:** `portfolio contact form`
   - **Hostnames:** `asgatcreation.vercel.app`, plus your own domain when you have one. Add `localhost`
     as well if you want the widget to appear while testing on your own machine.
   - **Widget mode:** **Managed** (Cloudflare decides when to challenge).
   - **Region:** choose the one nearest you. **This cannot be changed later.**
3. Press **Create**. You now see two keys:
   - **Site key** — public, it goes in the page.
   - **Secret key** — private, it goes in Vercel only.

Skipping this part is fine: without it the honeypot still works, and nothing breaks.

---

## Part 4 — Tell the site about the keys

In Vercel: your project → **Settings** → **Environment Variables**. Add each one for **All Environments**
unless you want preview deploys to stay silent.

| Name                        | Value                                         | Mark as   |
| --------------------------- | --------------------------------------------- | --------- |
| `BREVO_API_KEY`             | the key from part 2                           | Sensitive |
| `CONTACT_TO`                | the address where you want messages to arrive | Sensitive |
| `CONTACT_FROM`              | the sender address you verified in Brevo      | plain     |
| `TURNSTILE_SECRET_KEY`      | the secret key from part 3                    | Sensitive |
| `PUBLIC_TURNSTILE_SITE_KEY` | the site key from part 3                      | plain     |
| `SITE_URL`                  | `https://asgatcreation.vercel.app`            | plain     |

Vercel offers a **Sensitive** tick on a variable, which stops it being shown again after you save it. Use
it for the three marked above.

Then redeploy so the build picks up the new values: **Deployments** → the latest one → the **…** menu →
**Redeploy**.

### Check that it works

1. Open your site, go to **Contact**, and send yourself a real message.
2. You should get it at `CONTACT_TO` within a minute, and pressing reply should reply to _you_ (the
   function sets the sender as reply-to).
3. The visitor — you, in this test — should also get the automatic "I have your message" email. To turn
   that off, add `CONTACT_AUTOREPLY` = `off`.
4. If nothing arrives: check the Brevo **Logs** page first (it shows rejected sends and why), then Vercel's
   **Logs** tab on the project, which shows every call to `/api/contact`.

---

## Part 5 — Your own domain, when you buy one

`asgatcreation.vercel.app` works forever and costs nothing, so this can wait. When you do buy one, nothing
breaks: the vercel.app address keeps working alongside it.

1. Buy the domain anywhere — Namecheap, Cloudflare Registrar (sells at cost), or Vercel itself, which
   sells domains from the same dashboard and wires everything up for you.
   Checked on 18 November 2026, `asgatcreation.dev`, `asgatcreation.com` and `asgatcreation.app` were all
   unregistered. `.dev` is a normal domain anyone can buy, and it is on the browsers' HTTPS-only list —
   every visit must use HTTPS, which this site does anyway, so there is nothing extra to do.
2. In Vercel: your project → **Settings** → **Domains** → type the domain → **Add**. Vercel tells you
   exactly which DNS records to create at your registrar, and issues the HTTPS certificate itself.
3. Afterwards, update three things so links and email stay right:
   - the `SITE_URL` environment variable → your new address, then redeploy (this switches on the sitemap);
   - the Turnstile widget's hostname list → add the new domain;
   - in Brevo, add the domain under **Domains** so email comes from `hello@yourdomain` rather than Gmail.

---

## What this costs

Nothing, at this size: Vercel's Hobby plan and Turnstile are free, and Brevo's free tier is 300 emails a
day. A domain is the only real cost, roughly $10 a year. Nothing here asks for a card.
