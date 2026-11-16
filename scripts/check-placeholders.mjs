// Fails the build if an [[ADD: ...]] placeholder reaches a published page.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = 'dist';
const hits = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|xml|json|txt|js)$/.test(name)) {
      const text = readFileSync(p, 'utf8');
      const m = text.match(/\[\[ADD[^\]]*\]\]/g);
      if (m) hits.push(`${p}: ${[...new Set(m)].join(', ')}`);
    }
  }
};
walk(root);
if (hits.length) {
  console.error(`✗ ${hits.length} file(s) still contain placeholders:\n` + hits.map((h) => '  ' + h).join('\n'));
  process.exit(1);
}
console.log('✓ No placeholders in the built site.');
