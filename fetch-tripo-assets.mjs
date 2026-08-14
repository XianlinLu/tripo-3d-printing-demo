import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const STUDIO_URL =
  "https://studio.tripo3d.ai/?category=featured&model_type=all&recommended=recommended&use_case=all";
const OUTPUT_DIR = join(process.cwd(), "public", "tripo", "studio-gallery");
const REQUIRED = 7;

function decodeEmbeddedUrl(value) {
  return value
    .replaceAll("\\u0026", "&")
    .replaceAll("\\u003d", "=")
    .replaceAll("\\/", "/")
    .replaceAll("&amp;", "&")
    .replaceAll("&#38;", "&")
    .replaceAll("&#x26;", "&")
    .replaceAll("\\u002F", "/")
    .replace(/\\+$/g, "");
}

function collectStudioImages(html) {
  const normalized = decodeEmbeddedUrl(html);
  const candidates =
    normalized.match(
      /https:\/\/tripo-data-public\.rg1\.data\.tripo3d\.com\/tripo-studio\/[^"'<>\\\s]+?studio_mesh\.webp(?:\?[^"'<>\\\s]+)?/g
    ) ?? [];

  const unique = [];
  const seen = new Set();

  for (const raw of candidates) {
    const cleaned = decodeEmbeddedUrl(raw).replace(/&quot;.*$/i, "");
    try {
      const parsed = new URL(cleaned);
      const key = `${parsed.origin}${parsed.pathname}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(cleaned);
    } catch {
      // Skip malformed URLs.
    }
  }

  return unique;
}

async function fetchImage(url, index) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/151 Safari/537.36",
      referer: "https://studio.tripo3d.ai/",
      accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Image ${index} failed: HTTP ${response.status}`);
  }

  const type = response.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) {
    throw new Error(`Image ${index} returned ${type || "unknown content type"}`);
  }

  const data = Buffer.from(await response.arrayBuffer());
  if (data.length < 8_000) {
    throw new Error(`Image ${index} is unexpectedly small (${data.length} bytes)`);
  }

  return data;
}

console.log(`Fetching TRIPO Studio gallery: ${STUDIO_URL}`);

const pageResponse = await fetch(STUDIO_URL, {
  redirect: "follow",
  headers: {
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/151 Safari/537.36",
    accept: "text/html,application/xhtml+xml",
  },
});

if (!pageResponse.ok) {
  throw new Error(`TRIPO Studio page failed: HTTP ${pageResponse.status}`);
}

const html = await pageResponse.text();
const urls = collectStudioImages(html);

console.log(`Found ${urls.length} unique featured model images.`);

if (urls.length < REQUIRED) {
  throw new Error(
    `Need at least ${REQUIRED} unique TRIPO Studio images, only found ${urls.length}.`
  );
}

await mkdir(OUTPUT_DIR, { recursive: true });

for (let i = 0; i < REQUIRED; i += 1) {
  const fileName = `gallery-${String(i + 1).padStart(2, "0")}.webp`;
  const data = await fetchImage(urls[i], i + 1);
  await writeFile(join(OUTPUT_DIR, fileName), data);
  console.log(`Saved ${fileName} (${data.length} bytes)`);
}

console.log(`Saved ${REQUIRED} non-repeating TRIPO Studio images.`);
