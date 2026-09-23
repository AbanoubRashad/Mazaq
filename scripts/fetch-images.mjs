#!/usr/bin/env node
/**
 * pnpm images:fetch
 *
 * Verifies every photo in packages/menu/src/images.json returns HTTP 200, downloads it at
 * 1600px into apps/web/public/images/ and copies it to apps/mobile/assets/images/, then
 * regenerates CREDITS.md. Photos are from Unsplash (Unsplash License). Never hotlink in
 * production — always serve the downloaded copies.
 *
 * Flags: --force  re-download files that already exist
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogue = JSON.parse(
  fs.readFileSync(path.join(root, 'packages/menu/src/images.json'), 'utf8'),
);
const webDir = path.join(root, 'apps/web/public/images');
const mobileDir = path.join(root, 'apps/mobile/assets/images');
const force = process.argv.includes('--force');

fs.mkdirSync(webDir, { recursive: true });
fs.mkdirSync(mobileDir, { recursive: true });

const url = (id, w) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&fm=jpg&fit=max`;

let failed = 0;
for (const [key, entry] of Object.entries(catalogue)) {
  const webPath = path.join(webDir, entry.file);
  const mobilePath = path.join(mobileDir, entry.file);
  if (!force && fs.existsSync(webPath) && fs.existsSync(mobilePath)) {
    console.log(`✓ ${key.padEnd(24)} exists`);
    continue;
  }
  try {
    const head = await fetch(url(entry.unsplashId, 1600), { method: 'HEAD' });
    if (head.status !== 200) throw new Error(`HEAD ${head.status}`);
    const res = await fetch(url(entry.unsplashId, 1600));
    if (!res.ok) throw new Error(`GET ${res.status}`);
    fs.writeFileSync(webPath, Buffer.from(await res.arrayBuffer()));
    // The app gets a lighter 800px copy — plenty for phone screens.
    const small = await fetch(url(entry.unsplashId, 800));
    if (!small.ok) throw new Error(`GET 800 ${small.status}`);
    fs.writeFileSync(mobilePath, Buffer.from(await small.arrayBuffer()));
    console.log(`↓ ${key.padEnd(24)} ${entry.file}`);
  } catch (err) {
    failed++;
    console.error(`✗ ${key.padEnd(24)} ${err.message} — search Unsplash for a replacement`);
  }
}

const rows = Object.entries(catalogue)
  .map(
    ([, e]) =>
      `| \`${e.file}\` | ${e.alt.en} | ${e.photographer}${e.confirmed ? '' : ' ⚠️ confirm'} | [photo-${e.unsplashId}](https://images.unsplash.com/photo-${e.unsplashId}) |`,
  )
  .join('\n');

fs.writeFileSync(
  path.join(root, 'CREDITS.md'),
  `# Photo credits

All photographs are from [Unsplash](https://unsplash.com) and used under the
[Unsplash License](https://unsplash.com/license) (free for commercial use; attribution appreciated).
Regenerate this file with \`pnpm images:fetch\`.

Rows marked ⚠️ are photos the brief supplied by URL whose photographer could not be
confirmed automatically — open the image on Unsplash and fill in the name before launch.

Bean-bag artwork is original SVG (\`BeanBag\` component), not photography. The Halloumi & Za'atar
Wrap has no photo yet and shows illustrated product art.

| File | Subject | Photographer | Source |
|---|---|---|---|
${rows}
`,
);

console.log(`\nWrote CREDITS.md. ${failed ? `${failed} failed.` : 'All images OK.'}`);
process.exit(failed ? 1 : 0);
