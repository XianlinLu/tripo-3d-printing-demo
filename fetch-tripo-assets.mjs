import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const outDir = join(process.cwd(), 'public', 'tripo', 'site-assets');

// All URLs below are static image assets served by the official tripo3d.ai site.
// Some are reused intentionally so the demo never falls back to broken hotlinked _ipx URLs.
const assets = [
  ['model.webp', 'https://www.tripo3d.ai/new/section-texturing/step-input.webp'],
  ['texture.webp', 'https://www.tripo3d.ai/new/section-texturing/step-input.webp'],
  ['brush.webp', 'https://www.tripo3d.ai/new/section-community/part-left.webp'],
  ['rigging.png', 'https://www.tripo3d.ai/new/section-rigging/step-rigging.png'],
  ['advantage.webp', 'https://www.tripo3d.ai/new/section-community/part-right.webp'],
  ['community-left.webp', 'https://www.tripo3d.ai/new/section-community/part-left.webp'],
  ['community-right.webp', 'https://www.tripo3d.ai/new/section-community/part-right.webp'],
];

await mkdir(outDir, { recursive: true });

for (const [fileName, url] of assets) {
  console.log(`Fetching ${url}`);
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'Mozilla/5.0',
      'referer': 'https://www.tripo3d.ai/',
      'accept': 'image/avif,image/webp,image/apng,image/png,image/*,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${response.status}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`Unexpected content type for ${url}: ${contentType || 'unknown'}`);
  }

  const data = Buffer.from(await response.arrayBuffer());
  if (data.length < 1024) {
    throw new Error(`Downloaded asset is unexpectedly small: ${url} (${data.length} bytes)`);
  }

  await writeFile(join(outDir, fileName), data);
  console.log(`Saved ${fileName} (${data.length} bytes)`);
}

console.log(`Fetched ${assets.length} TRIPO images.`);
