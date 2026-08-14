# TRIPO 3D Printing Demo — Final merged update (2026-08-15)

This folder consolidates the latest project state and all updates made today.

## Included updates
- Refined dark immersive Benefits/Services visual treatment with the central rock composition and four capability cards.
- Rebuilt Workflow as a clean 3×3 card system and removed the two diagonal lines.
- Reduced the final CTA/footer section height and added the dark rock/smoke composition.
- Reworked the navigation menu into a narrow right-side drawer and corrected close-button alignment.
- Preserved the supplied TRIPO logo treatment for the header/menu.
- Corrected Hero title line spacing.
- Added two-state Sound control: muted by default, sound-wave icon when enabled.
- Rebuilt Hero hold-to-blast behavior: ~0.5 s charge, large deterministic panel explosion, continued floating/spinning while held, and smooth reassembly on release.
- Hero UI groups (logo, controls, headline, CTAs, meta text, hold hint, scroll indicator) drift independently during Blast.
- Retained guide-line hover welding/spark interaction.
- Updated GitHub Pages build workflow to crawl seven unique images from the current TRIPO Studio Featured gallery and use non-repeating media across Key Facts, Case Studies and Workflow.

## GitHub Pages
The included `.github/workflows/pages.yml` builds the project with:

`NEXT_PUBLIC_BASE_PATH=/tripo-3d-printing-demo`

and deploys the exported `out/` directory to GitHub Pages.

## Important
Upload the *contents of this folder* to the repository root. If the repository still contains the old misspelled `.ghithub/` directory, it can be deleted; GitHub Actions only uses `.github/workflows/`.
