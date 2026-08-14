import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const outDir = join(process.cwd(), 'public', 'tripo', 'site-assets');

const assets = [
  ['model.webp', 'https://www.tripo3d.ai/new/section-model-generator/step-gen-3d.webp'],
  ['texture.webp', 'https://www.tripo3d.ai/new/section-texturing/step-input.webp'],
  ['brush.webp', 'https://www.tripo3d.ai/new/section-texturing/magic-brush.webp'],
  ['rigging.png', 'https://www.tripo3d.ai/new/section-rigging/step-rigging.png'],
  ['advantage.webp', 'https://www.tripo3d.ai/new/section-advantages/effect-1.webp'],
  ['community-left.webp', 'https://www.tripo3d.ai/new/section-community/part-left.webp'],
  ['community-right.webp', 'https://www.tripo3d.ai/new/section-community/part-right.webp'],
];

await mkdir(outDir, { recursive: true });

for (const [fileName, url] of assets) {
  console.log(`Fetching ${url}`);
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; TRIPO demo asset fetcher)',
      'referer': 'https://www.tripo3d.ai/',
      'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
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

  const outPath = join(outDir, fileName);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, data);
  console.log(`Saved ${outPath} (${data.length} bytes)`);
}

console.log(`Fetched ${assets.length} official TRIPO website images.`);
