# 0009 — One theme, taken from the logo: black, gold and silver

- Date: 19 November 2026
- Status: Accepted. Supersedes the visual direction recorded in
  [PROGRESS.md milestone 2](../PROGRESS.md) (direction E, "Spotlight").

## Context

Direction E was approved as a mockup in milestone 2 and built in milestone 3. When the owner saw it on a
real deployed site he rejected it outright — the colours, the amount of motion, the typography and the
direction as a whole.

Three replacement directions were built (F Studio, G Swiss, H Desk) and all three were rejected too. That
is four misses, which meant the problem was not the execution but the brief, so the owner was asked
directly. His answer named the thing nobody had checked: **his logo's colour.**

Two things then became clear.

**The site was already black and gold — in dark mode.** The tokens were `--bg: #07070a`, `--gold: #e6b450`.
What the owner had been looking at was the **light** theme: `--bg: #faf7f1`, a cream paper colour. The gold
was never the problem; the cream it sat on was. Dropping gold from directions F, G and H had been a
correction in the wrong direction.

**Nothing had been built from the actual logo.** Sampling `public/img/logo-avatar.jpg` gives a precise
palette: true black `#000000`, a metallic gold running `#7c4c03 → #c78212 → #f2c24f`, and silver
`#b6b6b6`–`#d5d5d5`. The gradient is what makes the mark read as metal rather than flat yellow, and the
old `--gold: #e6b450` was a flat approximation of it.

## Decision

**One theme.** The palette is the brand, and the brand has no light version. The light tokens, the toggle,
the stored `theme` preference and the palette's theme action are all gone. The site deletes any previously
stored choice on first visit, so nobody is stranded on a theme that no longer exists.

**The palette comes from the logo, not from taste.** `--bg: #000000`, the gold gradient above, and silver
`#d5d5d5` for body text in place of the old warm cream `#f4f1ea`.

**Typography changes** from Syne and Manrope to **Outfit** and **Inter**. Syne's display face was doing much
of the work the owner disliked. JetBrains Mono stays for code.

**Four pieces of motion and decoration were removed**, all named in the rejection:

- the hollow outlined "I build." (`-webkit-text-stroke`) — now solid, like the lines around it;
- the particle constellation canvas behind the hero;
- the typing effect that cycled eight phrases — replaced with one true sentence;
- the preloader with its fake percentage, and the custom gold cursor.

The footer's giant outlined word became a solid, very dim watermark, since it was the same treatment that
was rejected on the headline. The corner radius drops from 22px to 6px.

## Consequences

Good: the site now matches the logo exactly, and the one thing the owner has consistently liked — his own
mark — sets the colours rather than competing with them. Removing the light theme removes a whole class of
contrast bugs and halves what has to be checked on every page. Less motion means less to go wrong for
anyone on a slow device.

Costs: visitors who prefer light interfaces get no choice. This is deliberate and it is the owner's call;
the alternative is the cream site he rejected. The palette is also recorded in `docs/PROGRESS.md` and in
the mockup at `design/mockups/i-obsidian/`, so if the logo ever changes, those are the three places to
update together.

The rejected directions F, G and H stay in `design/mockups/` as the record of how this was reached, exactly
as A–E did.
