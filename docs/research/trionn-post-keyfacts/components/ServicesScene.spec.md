# ServicesScene Specification

## Overview

- Target: `trionn-post-keyfacts/ServicesScene.tsx`
- Screenshots: `docs/design-references/trionn-post-keyfacts/05-services-transition.png` and `06-services-stone.png`
- Interaction: scroll-driven inside WorkShowcase
- Background transitions from white to `#000`.

## Layers

1. 371-frame centered stone sequence, full viewport height.
2. Muted looping smoke video with `mix-blend-mode: screen`.
3. White transition cover.
4. Centered service label and giant stacked words.
5. Six moving glass capability cards.
6. Bottom statement and link.

## Card behavior

- Width 28vw; height 32vh; 8px radius.
- Dark translucent surface with 15px backdrop blur.
- Three left/right pairs travel through viewport arcs.
- Each pair fades in and back out during its scroll window.

## Assets

- `public/tripo/trionn-reference/stone/frame_0001.webp` through `frame_0371.webp`
- `public/tripo/trionn-reference/homepage-services-video.mp4`
