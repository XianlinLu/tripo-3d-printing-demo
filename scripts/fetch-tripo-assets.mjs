import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const FEATURED_URL =
  "https://studio.tripo3d.ai/?category=featured&model_type=all&recommended=recommended&use_case=all";
const GALLERY_DIR = join(process.cwd(), "public", "tripo", "studio-gallery");
const SITE_DIR = join(process.cwd(), "public", "tripo", "site-assets");
const REQUIRED_GENERAL = 7;

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
  const candidates = normalized.match(
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
      // Ignore malformed URLs.
    }
  }
  return unique;
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/151 Safari/537.36",
      accept: "text/html,application/xhtml+xml",
    },
  });
  if (!response.ok) throw new Error(`${url} failed: HTTP ${response.status}`);
  return response.text();
}

async function fetchImage(url, label) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/151 Safari/537.36",
      referer: url.includes("studio.tripo3d.ai") || url.includes("tripo-data-public")
        ? "https://studio.tripo3d.ai/"
        : "https://www.tripo3d.ai/",
      accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    },
  });
  if (!response.ok) throw new Error(`${label} failed: HTTP ${response.status}`);
  const type = response.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) throw new Error(`${label} returned ${type || "unknown content type"}`);
  const data = Buffer.from(await response.arrayBuffer());
  if (data.length < 4_000) throw new Error(`${label} is unexpectedly small (${data.length} bytes)`);
  return data;
}

async function saveImage(url, dir, fileName) {
  const data = await fetchImage(url, fileName);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, fileName), data);
  console.log(`Saved ${fileName} (${data.length} bytes)`);
}

async function firstUniqueFromGalleryPage(pageUrl, usedKeys, fallbackUrls) {
  try {
    const html = await fetchText(pageUrl);
    const urls = collectStudioImages(html);
    for (const url of urls) {
      const parsed = new URL(url);
      const key = `${parsed.origin}${parsed.pathname}`;
      if (!usedKeys.has(key)) {
        usedKeys.add(key);
        return url;
      }
    }
  } catch (error) {
    console.warn(`Semantic gallery fallback for ${pageUrl}:`, error instanceof Error ? error.message : error);
  }

  for (const url of fallbackUrls) {
    const parsed = new URL(url);
    const key = `${parsed.origin}${parsed.pathname}`;
    if (!usedKeys.has(key)) {
      usedKeys.add(key);
      return url;
    }
  }
  throw new Error(`No unique TRIPO image available for ${pageUrl}`);
}

console.log(`Fetching TRIPO Studio gallery: ${FEATURED_URL}`);
const featuredHtml = await fetchText(FEATURED_URL);
const featuredUrls = collectStudioImages(featuredHtml);
if (featuredUrls.length < REQUIRED_GENERAL) {
  throw new Error(`Need at least ${REQUIRED_GENERAL} unique TRIPO Studio images, only found ${featuredUrls.length}.`);
}

await mkdir(GALLERY_DIR, { recursive: true });
await mkdir(SITE_DIR, { recursive: true });

const usedKeys = new Set();
for (let i = 0; i < REQUIRED_GENERAL; i += 1) {
  const url = featuredUrls[i];
  const parsed = new URL(url);
  usedKeys.add(`${parsed.origin}${parsed.pathname}`);
  await saveImage(url, GALLERY_DIR, `gallery-${String(i + 1).padStart(2, "0")}.webp`);
}

// Case-study images are sourced from semantically matching TRIPO Studio gallery pages.
const semanticCases = [
  ["case-jewelry.webp", "https://studio.tripo3d.ai/3d-model-gallery/jewelry"],
  ["case-sculpture.webp", "https://studio.tripo3d.ai/3d-model-gallery/sculpture"],
  ["case-miniature.webp", "https://studio.tripo3d.ai/3d-model-gallery/tabletop-miniature"],
];
for (const [fileName, pageUrl] of semanticCases) {
  const url = await firstUniqueFromGalleryPage(pageUrl, usedKeys, featuredUrls);
  await saveImage(url, GALLERY_DIR, fileName);
}

// Unique official TRIPO feature imagery for the dark workflow/services sequence.
const serviceAssets = [
  ["service-core.webp", "https://www.tripo3d.ai/new/section-advantages/effect-1.webp"],
  ["service-input.webp", "https://www.tripo3d.ai/new/section-model-generator/step-gen-3d.webp"],
  ["service-print.webp", "https://www.tripo3d.ai/new/section-texturing/magic-brush.webp"],
  ["service-topology.png", "https://www.tripo3d.ai/new/section-rigging/step-rigging.png"],
  ["service-detail.webp", "https://www.tripo3d.ai/new/section-texturing/step-input.webp"],
];
for (const [fileName, url] of serviceAssets) {
  await saveImage(url, SITE_DIR, fileName);
}

console.log("TRIPO imagery ready: unique Key Facts, case studies, workflow accents and service visuals.");
