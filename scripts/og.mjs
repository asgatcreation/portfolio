/**
 * Builds the social preview cards in public/og/.
 *
 * Run it by hand with `npm run og` whenever a project's title, tagline or status changes.
 * The cards are committed to the repository on purpose: generating them during the build
 * would make every deploy depend on sharp and on which fonts the build machine happens to
 * have installed. A committed PNG always looks the same.
 *
 * Nothing here invents content. Every line of text on a card is copied from the project's
 * own JSON file or from src/data/site.ts.
 */
import { readFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'og');

const W = 1200;
const H = 630;
const PAD = 72;
const LOGO = 96;
/** Segoe UI on Windows, Helvetica on macOS, DejaVu on Linux: whatever the machine has. */
const FONT = 'Segoe UI, Helvetica Neue, Helvetica, DejaVu Sans, Arial, sans-serif';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Greedy line wrapper. SVG has no automatic wrapping, so the lines are measured here with a
 * rough average character width — close enough for display sizes, and every card is checked
 * by eye after generation.
 */
function wrap(text, size, maxWidth, maxLines) {
  const perChar = size * 0.52;
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length * perChar > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    } else {
      line = next;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines) {
    const used = lines.join(' ').split(/\s+/).length;
    if (used < words.length) lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[.,;:]$/, '')}…`;
  }
  return lines;
}

function card({ eyebrow, title, titleSize, body, chips }) {
  const titleLines = wrap(title, titleSize, W - PAD * 2 - 40, 2);
  const bodyLines = body ? wrap(body, 30, W - PAD * 2 - 40, 3) : [];

  // The block is laid out from the top of the title so the card stays balanced whether the
  // title runs to one line or two.
  const titleTop = 272 - (titleLines.length - 1) * (titleSize * 0.56);
  const bodyTop = titleTop + (titleLines.length - 1) * titleSize * 1.12 + 72;

  const titleSvg = titleLines
    .map(
      (l, i) =>
        `<text x="${PAD}" y="${titleTop + i * titleSize * 1.12}" font-family="${FONT}" font-size="${titleSize}" font-weight="700" fill="#f3f1ee" letter-spacing="-1">${esc(l)}</text>`,
    )
    .join('');

  const bodySvg = bodyLines
    .map(
      (l, i) =>
        `<text x="${PAD}" y="${bodyTop + i * 42}" font-family="${FONT}" font-size="30" font-weight="400" fill="#9b968e">${esc(l)}</text>`,
    )
    .join('');

  // Chips are measured from the text length, then drawn left to right along the bottom.
  let x = PAD;
  const chipSvg = (chips ?? [])
    .map((c) => {
      const w = Math.round(c.length * 11.2 + 40);
      const box = `<rect x="${x}" y="${H - 118}" width="${w}" height="46" rx="23" fill="#0f0d09" stroke="#3a3124"/><text x="${x + 20}" y="${H - 87}" font-family="${FONT}" font-size="20" font-weight="500" fill="#c9c4bc">${esc(c)}</text>`;
      x += w + 14;
      return box;
    })
    .join('');

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7c4c03"/>
      <stop offset="0.38" stop-color="#c78212"/>
      <stop offset="0.62" stop-color="#f2c24f"/>
      <stop offset="1" stop-color="#c78212"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.12" cy="0.08" r="0.75">
      <stop offset="0" stop-color="#c78212" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#c78212" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#000000"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="0" y="0" width="${W}" height="8" fill="url(#gold)"/>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="#241f17"/>
  <text x="${PAD}" y="${PAD + 46}" font-family="${FONT}" font-size="25" font-weight="600" fill="#f2c24f" letter-spacing="4">${esc(eyebrow.toUpperCase())}</text>
  <circle cx="${W - PAD - LOGO / 2}" cy="${PAD + LOGO / 2}" r="${LOGO / 2 + 3}" fill="none" stroke="url(#gold)" stroke-width="2"/>
  ${titleSvg}
  ${bodySvg}
  ${chipSvg}
  <text x="${W - PAD}" y="${H - 86}" text-anchor="end" font-family="${FONT}" font-size="22" font-weight="500" fill="#6b6761">asgatcreation</text>
</svg>`);
}

/** The logo, resized and masked into a circle once, then placed on every card. */
async function roundLogo() {
  const src = await sharp(path.join(root, 'public', 'img', 'logo-avatar.jpg'))
    .resize(LOGO, LOGO, { fit: 'cover' })
    .toBuffer();
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${LOGO}" height="${LOGO}"><circle cx="${LOGO / 2}" cy="${LOGO / 2}" r="${LOGO / 2}" fill="#fff"/></svg>`,
  );
  return sharp(src)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

async function write(name, svg, logo) {
  const file = path.join(outDir, `${name}.png`);
  await sharp(svg)
    .composite([{ input: logo, top: PAD, left: W - PAD - LOGO }])
    .png({ compressionLevel: 9, palette: true })
    .toFile(file);
  return file;
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const siteSrc = await readFile(path.join(root, 'src', 'data', 'site.ts'), 'utf8');
  const name = siteSrc.match(/name: '([^']+)'/)[1];
  const headline = siteSrc.match(/headline: '([^']+)'/)[1];

  const logo = await roundLogo();
  const made = [];

  made.push(
    await write(
      'default',
      card({
        eyebrow: 'asgatcreation',
        title: name,
        titleSize: 68,
        body: headline.replace(/&/g, 'and'),
        chips: ['Software engineering', 'Data science', 'Statistics'],
      }),
      logo,
    ),
  );

  const dir = path.join(root, 'src', 'content', 'projects');
  for (const f of (await readdir(dir)).filter((f) => f.endsWith('.json'))) {
    const p = JSON.parse(await readFile(path.join(dir, f), 'utf8'));
    if (p.draft) continue;
    made.push(
      await write(
        path.basename(f, '.json'),
        card({
          eyebrow: 'Case study',
          title: p.title,
          titleSize: 76,
          body: p.tagline,
          chips: [p.statusLabel, ...p.stack.slice(0, 2)],
        }),
        logo,
      ),
    );
  }

  console.log(`${made.length} social cards written to public/og/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
