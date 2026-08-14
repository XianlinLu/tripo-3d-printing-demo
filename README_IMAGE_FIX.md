# TRIPO image fix

This patch removes the broken remote `_ipx` image hotlinks.

Upload the following three files to the same paths in the GitHub repository:

1. `scripts/fetch-tripo-assets.mjs` (new file)
2. `src/components/tripo-3d-printing/content.ts` (replace existing file)
3. `.github/workflows/pages.yml` (replace existing file)

After commit, GitHub Actions will download the official TRIPO website images during the build and package them into the static GitHub Pages artifact under `/tripo/site-assets/`.

The website no longer depends on the browser being allowed to hotlink TRIPO's `_ipx` image optimizer URLs.
