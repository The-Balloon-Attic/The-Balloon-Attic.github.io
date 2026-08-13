# Halloween

Drop photos for the **Halloween** gallery highlight directly into this folder.

That's the whole workflow:

1. Add your image file(s) here (`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, or `.avif`).
2. Commit and push to `main`.
3. A GitHub Action (`.github/workflows/update-gallery-manifest.yml`) automatically
   regenerates `assets/images/manifest.json` and the site picks up the new
   photos on the next deploy — no manual editing required.

Until this folder has at least one photo, the "Halloween" balloon on the site
shows as a muted "Coming soon" placeholder. It activates automatically as
soon as a photo lands here.
