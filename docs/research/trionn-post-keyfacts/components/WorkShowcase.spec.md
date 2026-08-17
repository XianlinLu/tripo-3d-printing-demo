# WorkShowcase Specification

## Overview

- Target: `trionn-post-keyfacts/WorkShowcase.tsx`
- Screenshots: `docs/design-references/trionn-post-keyfacts/02-work-intro.png` through `04-work-end.png`
- Interaction: pinned, scroll-driven horizontal rail
- Background: `linear-gradient(180deg, #fff 0%, #d2d2d2 100%)`
- Height: `1350vh`; sticky viewport: `100vh`

## DOM

- Work wrapper (`#cases`)
  - sticky viewport
  - Services layer
  - 250vw work rail
    - 50vw centered intro
    - three 50vw case panels
    - 50vw centered closing panel
  - bottom progress meter

## Typography and spacing

- Headings use the scoped Familjen Grotesk face.
- Work intro title: 48px, line-height 1.1.
- Project titles: 36px, line-height 1, tracking -0.04em.
- Body: 18px, line-height 1.05.
- Project inner padding: 64px 80px.
- Media ratio: 670/460 with 8px radius.

## Content

- Personalized Jewelry
- Art Sculpture
- Tabletop Miniatures

All imagery and copy come from the existing TRIPO content module.
