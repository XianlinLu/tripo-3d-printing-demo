const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const GALLERY_BASE = `${BASE}/tripo/studio-gallery`;
const SITE_ASSET_BASE = `${BASE}/tripo/site-assets`;

export const SITE = {
  logo: `${BASE}/tripo/tripo-logo.png`,
  audio: `${BASE}/tripo/tripo-audio.mp3`,
};

export const TRIPO_ASSETS = {
  factModel: `${GALLERY_BASE}/gallery-01.webp`,
  factTexture: `${GALLERY_BASE}/gallery-02.webp`,
  caseJewelry: `${GALLERY_BASE}/case-jewelry.webp`,
  caseSculpture: `${GALLERY_BASE}/case-sculpture.webp`,
  caseMiniature: `${GALLERY_BASE}/case-miniature.webp`,
  workflowLeft: `${GALLERY_BASE}/gallery-06.webp`,
  workflowRight: `${GALLERY_BASE}/gallery-07.webp`,
  serviceCore: `${SITE_ASSET_BASE}/service-core.webp`,
  serviceInput: `${SITE_ASSET_BASE}/service-input.webp`,
  servicePrint: `${SITE_ASSET_BASE}/service-print.webp`,
  serviceTopology: `${SITE_ASSET_BASE}/service-topology.webp`,
  serviceDetail: `${SITE_ASSET_BASE}/service-detail.webp`,
};

export const hero = {
  eyebrow: "AI 3D PRINTING · IMAGE TO 3D · TEXT TO 3D",
  titleLines: ["Get Production-Ready", "3D Print Files", "from Inspiration."],
  description:
    "The first step of 3D printing is a printable 3D model. Tripo turns text, images and sketches into production-ready 3D assets in seconds, with clean topology and a workflow built for real creation.",
  primary: "CREATE MODELS",
  secondary: "SEE PRINT EXAMPLES",
  metrics: [
    { value: "1 MIN", label: "FAST MODEL GENERATION" },
    { value: "PRINT-READY", label: "CLEAN, STABLE GEOMETRY" },
  ],
};

export const statement = {
  kicker: "TURN VISION INTO FINAL PRINTS",
  line1: "Tripo turns creative ideas into",
  line2: "production-ready 3D assets through AI.",
  body: "From image and text generation to clean topology, texturing and rigging, one workspace connects inspiration to usable 3D output.",
  marquee: ["CREATE", "PRINT", "ITERATE", "IMPACT"],
};

export const facts = [
  { value: "6.5M+", label: "Creators worldwide" },
  { value: "40K+", label: "Active developers" },
  { value: "700+", label: "Industry clients" },
  { value: "100M+", label: "3D models created" },
];

export const cases = [
  {
    kicker: "PERSONALIZED JEWELRY",
    title: "One-pass modeling with sharp, detailed precision.",
    body: "Generate clean, high-precision forms from reference images while keeping wall thickness and geometry suitable for production workflows.",
    image: TRIPO_ASSETS.caseJewelry,
  },
  {
    kicker: "ART SCULPTURE",
    title: "Intricate geometry with stronger structural integrity.",
    body: "Move from concept art to complex printable forms with cleaner surfaces and fewer structural repair steps.",
    image: TRIPO_ASSETS.caseSculpture,
  },
  {
    kicker: "TABLETOP MINIATURES",
    title: "Scale cohesion, stable poses and detailed characters.",
    body: "Use text or images to create character models with a stable base, readable silhouette and detail that survives small-scale printing.",
    image: TRIPO_ASSETS.caseMiniature,
  },
];

export const capabilities = [
  {
    number: "01",
    short: "IMAGE TO 3D",
    title: "Turn image and text into 3D instantly",
    body: "Upload an image or describe what you want in plain language. Tripo generates a usable 3D asset without a traditional modeling learning curve.",
  },
  {
    number: "02",
    short: "PRINT SUCCESS",
    title: "Increase 3D printing success rate",
    body: "Cleaner, more robust geometry reduces the amount of manual repair needed before slicing and printing.",
  },
  {
    number: "03",
    short: "CLEAN TOPOLOGY",
    title: "Less error, less repair",
    body: "Tripo optimizes geometry and topology so assets move through downstream production with fewer structural issues.",
  },
  {
    number: "04",
    short: "HIGH FIDELITY",
    title: "Lifelike detail with a natural look",
    body: "High-detail generation preserves important forms, surfaces and small features for closer visual fidelity.",
  },
];

export const formats = ["STL", "OBJ", "3MF", "FBX", "GLB", "USDZ"];

export const helixCards = [
  { eyebrow: "01", title: "Image to 3D", body: "Turn a single image into a structured 3D starting point." },
  { eyebrow: "02", title: "Text to 3D", body: "Describe the object, style and pose in natural language." },
  { eyebrow: "03", title: "Segmentation", body: "Split complex models into editable, structured parts." },
  { eyebrow: "04", title: "AI Texturing", body: "Apply high-resolution PBR-ready textures and local repainting." },
  { eyebrow: "05", title: "Rigging", body: "Generate skeletons and skin weights for animation-ready assets." },
  { eyebrow: "06", title: "Clean topology", body: "Prepare geometry for a more reliable production workflow." },
  { eyebrow: "07", title: "High detail", body: "Preserve small forms and surface information." },
  { eyebrow: "08", title: "Print workflows", body: "Export assets into formats used by common print pipelines." },
  { eyebrow: "09", title: "One workspace", body: "Connect generation, editing and output in a single workflow." },
];

export const formatCards = formats.map((title) => ({
  title,
  text: `${title} output for downstream 3D production and review workflows.`,
}));
