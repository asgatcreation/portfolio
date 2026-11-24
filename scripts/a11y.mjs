/**
 * Runs axe-core over every built page and fails if any page breaks a WCAG 2.1 A or AA rule.
 *
 * Run it with `npm run a11y` after a build. It checks the HTML as it is served: structure,
 * names, roles, labels, landmarks, heading order and ARIA. Colour contrast needs a real
 * browser to measure, so it is excluded here and checked in a browser instead.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';
import axe from 'axe-core';

const root = 'dist';

function pages(dir = root, found = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) pages(p, found);
    else if (name.endsWith('.html')) found.push(p);
  }
  return found;
}

const files = pages().sort();
let failed = 0;
let checked = 0;

for (const file of files) {
  // jsdom logs every CSS rule it cannot parse; none of that is about accessibility.
  const virtualConsole = new VirtualConsole();
  const dom = new JSDOM(readFileSync(file, 'utf8'), {
    url: 'https://example.com/' + relative(root, file).split(sep).join('/'),
    virtualConsole,
    pretendToBeVisual: true,
    // Lets this script evaluate axe inside the page. The site's own scripts are not run:
    // the audit is of the HTML as it is served, before any JavaScript changes it.
    runScripts: 'outside-only',
  });
  const { window } = dom;
  window.eval(axe.source);

  const results = await window.axe.run(window.document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
    // Needs real layout and painting, so it is measured in a browser rather than guessed here.
    rules: { 'color-contrast': { enabled: false } },
    resultTypes: ['violations'],
  });

  checked++;
  if (results.violations.length) {
    failed++;
    console.error(`\n✗ ${relative(root, file)}`);
    for (const v of results.violations) {
      console.error(`   [${v.impact}] ${v.id}: ${v.help}`);
      for (const node of v.nodes.slice(0, 4)) {
        console.error(`      ${node.html.replace(/\s+/g, ' ').slice(0, 140)}`);
        const why = (node.failureSummary || '').split('\n').filter(Boolean).slice(1, 3).join(' ');
        if (why) console.error(`      → ${why}`);
      }
      if (v.nodes.length > 4) console.error(`      …and ${v.nodes.length - 4} more`);
    }
  }
  window.close();
}

if (failed) {
  console.error(`\n✗ ${failed} of ${checked} pages have accessibility problems.`);
  process.exit(1);
}
console.log(`✓ ${checked} pages pass axe-core (WCAG 2.1 A and AA). Contrast is checked in a browser.`);
