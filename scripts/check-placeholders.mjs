// Fails the build if an [[ADD: ...]] placeholder reaches a published page, or if a page points
// at a social preview card that was never built.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = 'dist';
const hits = [];
const cards = new Set();
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|xml|json|txt|js)$/.test(name)) {
      const text = readFileSync(p, 'utf8');
      const m = text.match(/\[\[ADD[^\]]*\]\]/g);
      if (m) hits.push(`${p}: ${[...new Set(m)].join(', ')}`);
      for (const c of text.match(/\/og\/[a-z0-9-]+\.png/g) ?? []) cards.add(c);
    }
  }
};
walk(root);
if (hits.length) {
  console.error(`✗ ${hits.length} file(s) still contain placeholders:\n` + hits.map((h) => '  ' + h).join('\n'));
  process.exit(1);
}

// A missing card means a silent, invisible defect: the link previews as a blank grey box.
const missing = [...cards].filter((c) => !existsSync(join(root, c)));
if (missing.length) {
  console.error(
    `✗ ${missing.length} social preview card(s) are referenced but missing:\n` +
      missing.map((m) => '  ' + m).join('\n') +
      '\n  Run `npm run og` and commit the result.',
  );
  process.exit(1);
}

console.log(
  cards.size
    ? `✓ No placeholders in the built site, and all ${cards.size} social cards are present.`
    : '✓ No placeholders in the built site. (No social cards: SITE_URL is not set, so none were linked.)',
);
