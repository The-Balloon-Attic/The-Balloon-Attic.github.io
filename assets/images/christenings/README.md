# Christenings

Drop photos for the **Christenings** gallery highlight directly into this folder.

That's the whole workflow:

1. Add your image file(s) here (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, or `.avif`, in any letter case; not `.HEIC`).
2. Commit and push to `main`.
3. A GitHub Action (`.github/workflows/update-gallery-manifest.yml`) automatically
   regenerates `assets/images/manifest.js` + `manifest.json` and rebuilds the
   site, so the new photos show up within a few minutes — no manual editing required.

Until this folder has at least one photo, the "Christenings" balloon on the site
shows as a muted "Coming soon" placeholder. It activates automatically as
soon as a photo lands here.
