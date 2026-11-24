// Matching and ranking for the search box. Used by both the home page and the inner pages,
// so there is one definition of what "a good match" means.

/** Lower case, accents removed, punctuation turned into spaces. "Ojà Live" matches "oja live". */
export function norm(s) {
  return String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** True when `hay` contains `term` at the start of a word, not in the middle of one. */
function atWordStart(hay, term) {
  let from = 0;
  for (;;) {
    const at = hay.indexOf(term, from);
    if (at < 0) return false;
    if (at === 0 || !/[a-z0-9]/.test(hay[at - 1])) return true;
    from = at + 1;
  }
}

/**
 * Scores one entry against one term. Higher is better, 0 means no match at all.
 * A hit in the title is worth far more than a hit in the body, so searching "carhub"
 * puts CarHub first and the articles that merely mention it below.
 */
function scoreTerm(entry, term) {
  const t = entry._t;
  if (t === term) return 120;
  if (t.startsWith(term)) return 90;
  if (atWordStart(t, term)) return 70;
  if (t.includes(term)) return 45;
  const s = entry._s;
  if (atWordStart(s, term)) return 30;
  if (s.includes(term)) return 20;
  const b = entry._b;
  if (atWordStart(b, term)) return 12;
  if (b.includes(term)) return 6;
  return 0;
}

/**
 * Lower case, one character in for one character out. `norm` collapses runs of spaces and so
 * shifts every position after the first one; this keeps positions lined up with the original
 * text, which is what lets the snippet be cut out of it.
 */
function aligned(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9+#.-]/g, ' ');
}

/** Prepares the normalised fields once, rather than on every keystroke. */
export function prepare(entries) {
  return entries.map((e) => ({
    ...e,
    _t: norm(e.t),
    _s: norm(e.s),
    _b: norm(e.body || ''),
    _a: aligned(e.body || ''),
  }));
}

/**
 * What someone is most likely to want when the words appear in several places. Searching
 * "tenant isolation" should reach Curavia, which is the project that does it, before the Now
 * page, which happens to mention it in a sentence about Curavia.
 */
const GROUP_WEIGHT = { Projects: 6, AsgatArticles: 3 };

/**
 * Ranks prepared entries against a query. Every term must match somewhere (so "django live"
 * finds only the live Django projects), and entries matched only in the body are told apart
 * from entries matched in the title, which is what `where` reports.
 */
export function rank(entries, query, limit) {
  const phrase = norm(query);
  const terms = phrase.split(' ').filter(Boolean);
  if (!terms.length) return entries.slice(0, limit || 50).map((e) => ({ item: e, where: '' }));

  const out = [];
  for (const e of entries) {
    let total = 0;
    let best = 0;
    for (const term of terms) {
      const s = scoreTerm(e, term);
      if (!s) {
        total = 0;
        break;
      }
      total += s;
      if (s > best) best = s;
    }
    if (!total) continue;
    // Someone typing several words usually means them together. "in person" belongs to the
    // project whose page says "in person", not to one that happens to use both words apart.
    if (terms.length > 1) {
      if (e._t.includes(phrase)) total += 60;
      else if (e._s.includes(phrase)) total += 35;
      else if (e._b.includes(phrase)) total += 25;
    }
    total += GROUP_WEIGHT[e.g] || 0;
    // Shorter titles win ties: "CarHub" before "CarHub parts and accessories".
    out.push({ item: e, score: total - e._t.length * 0.05, where: best <= 12 ? bodyHint(e, terms) : '' });
  }
  out.sort((a, b) => b.score - a.score);
  return out.slice(0, limit || 50);
}

/** The few words around the first body match, so it is clear why a result is in the list. */
function bodyHint(entry, terms) {
  const body = entry.body || '';
  const hay = entry._a;
  for (const term of terms) {
    const at = hay.indexOf(term);
    if (at < 0) continue;
    const from = Math.max(0, hay.lastIndexOf(' ', Math.max(0, at - 28)) + 1);
    const to = hay.indexOf(' ', at + term.length + 28);
    const slice = body.slice(from, to < 0 ? body.length : to).trim();
    if (slice) return (from > 0 ? '…' : '') + slice + (to < 0 ? '' : '…');
  }
  return '';
}
