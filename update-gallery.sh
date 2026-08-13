#!/bin/bash
# Regenerates the gallery's image index (assets/images/manifest.js + manifest.json)
# by scanning the category folders on disk.
#
# Run this after adding/removing photos in assets/images/<category>/, whenever
# you want to preview the change locally before pushing. It's optional in
# normal use — the GitHub Action (.github/workflows/update-gallery-manifest.yml)
# does this automatically on every push — but running it locally first lets you
# see the result (open index.html directly, no server needed) before committing.
#
# Usage:
#   ./update-gallery.sh

set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js is required but wasn't found on your PATH." >&2
    echo "Install it from https://nodejs.org/ (any recent version works) and try again." >&2
    exit 1
fi

node scripts/generate-manifest.js
