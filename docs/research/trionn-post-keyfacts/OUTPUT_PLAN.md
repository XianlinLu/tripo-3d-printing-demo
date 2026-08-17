# Output Plan

- Existing application: `XianlinLu/tripo-3d-printing-demo`
- Existing route: `/`
- Integration boundary: after `KeyFactsSection`
- Preserved without component edits: `SiteNav`, `HeroSection`, `StatementSection`, `KeyFactsSection`
- Replaced below the boundary: current floating work gallery, services, helix gallery, and footer assembly
- New component namespace: `src/components/tripo-3d-printing/trionn-post-keyfacts/`
- New scoped stylesheet: `src/app/trionn-post-keyfacts-v2.css`
- Local reference assets: `public/tripo/trionn-reference/`
- Device target: desktop only, validated primarily at 1440px width
- Backend: none; all interactions are client-side and export-safe for GitHub Pages

The existing root route is intentionally updated because the user explicitly requested a partial replacement inside that route. No section above Key Facts is replaced or restyled.
