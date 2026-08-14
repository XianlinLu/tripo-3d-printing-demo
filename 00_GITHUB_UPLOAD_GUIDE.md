# GitHub upload guide — final merged version

Repository: `XianlinLu/tripo-3d-printing-demo`

1. Open the repository and choose **Add file → Upload files**.
2. Upload the **contents** of this folder to the repository root, preserving the directory structure.
3. Replace files when the same paths already exist.
4. Make sure `.github/workflows/pages.yml` exists. On macOS, press `Command + Shift + .` if hidden folders are not visible.
5. Commit with: `Merge final TRIPO SEO updates 2026-08-15`.
6. Open **Actions** and wait for `Deploy Next.js static site to Pages` to finish successfully.
7. Open `https://xianlinlu.github.io/tripo-3d-printing-demo/` and hard refresh if needed.

Expected workflow steps include:
- Crawl unique TRIPO Studio gallery images
- Verify unique gallery images
- npm run build
- Deploy to GitHub Pages
