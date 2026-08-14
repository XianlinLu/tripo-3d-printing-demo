# TRIPO 3D Printing Demo

A desktop-first, component-based Next.js landing experience for TRIPO 3D Printing.

## Live deployment target

`https://xianlinlu.github.io/tripo-3d-printing-demo/`

## Technology

- Next.js App Router + React + TypeScript
- Three.js WebGL scenes
- GSAP scroll-linked motion
- Lenis smooth scrolling
- Raycaster-based 3D hover interaction
- Guide-line spark interaction
- Hold-to-blast / release-to-reassemble interaction
- User-triggered soundtrack playback
- Static export for GitHub Pages

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Production check

```bash
npm run typecheck
npm run build
```

## GitHub Pages

The repository includes `.github/workflows/pages.yml`. A push to `main` builds a static export and publishes the `out/` directory to GitHub Pages.

The workflow sets:

```text
NEXT_PUBLIC_BASE_PATH=/tripo-3d-printing-demo
```

so assets resolve correctly under the project Pages URL.

## Main source folders

- `src/components/tripo-3d-printing/` — UI sections and WebGL scenes
- `public/tripo/` — local logo, audio and media assets
- `DESIGN_RATIONALE.md` — design and interaction rationale
