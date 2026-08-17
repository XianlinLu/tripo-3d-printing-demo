# Behavior Reference

## Work rail

- Interaction model: scroll-driven and pinned.
- Total scroll budget follows the extracted Trionn ratio: 1350% viewport height.
- Horizontal rail phase: progress `0..200/1350`; translation `0..-150vw`.
- Rail exit phase: progress `200/1350..350/1350`; translation adds `0..-100vw`.
- Project panels enter vertically from `550px` using the cubic center-distance formula extracted from the source.
- A one-pixel vertical divider draws from the top as each panel enters.
- The background stays `#fff` to `#d2d2d2` through the complete work phase.

## Services transition

- Interaction model: continuation of the pinned scroll scene.
- Services phase: `350/1350..1150/1350`.
- A white cover fades away during the first 12% of service progress.
- Stone imagery advances through 371 local WebP frames.
- Smoke video loops muted and uses screen blending.
- The central words remain stacked: `A.I.`, `Design`, `Development`, `Branding`.
- Six capability cards travel from below the viewport through paired left/right arcs, then fade out.

## Lower sections

- Production stories are click-driven tabs with an active progress line.
- Design in Motion is a static desktop composition with image hover scaling.
- Footer links keep their real TRIPO destinations.

## Constraints

- Desktop only; no new mobile navigation or mobile interaction model.
- Avoid horizontal document overflow; oversized tracks remain clipped by their sticky viewport.
- Honor `NEXT_PUBLIC_BASE_PATH` for GitHub Pages assets.
