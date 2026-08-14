# GitHub Upload Guide

Repository: `XianlinLu/tripo-3d-printing-demo`

## Important
Upload the **contents of this folder to the repository root**. Do not upload this folder as a nested subfolder.

The repository root should contain files such as:

```text
.github/
src/
public/
package.json
next.config.ts
README.md
DESIGN_RATIONALE.md
```

## Browser upload
1. Open the GitHub repository.
2. Choose **Add file → Upload files**.
3. Drag the contents of this folder into the upload area.
4. On macOS, press **Command + Shift + .** in Finder if `.github` is hidden, and make sure the `.github` folder is included.
5. Commit directly to `main` with a message such as `Deploy final TRIPO 3D demo`.
6. In **Settings → Pages**, set **Source** to **GitHub Actions**.
7. Open the **Actions** tab and wait for `Deploy Next.js static site to Pages` to finish.
8. Refresh `https://xianlinlu.github.io/tripo-3d-printing-demo/`.
