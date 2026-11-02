# Quenta TeraPost v0.9.0 — Product Studio Refresh

## Product identity and interface
- Product name: **Quenta TeraPost**. Company/product team: **Quentausas Corp**. KUNTAU Science Academy remains the institutional collaboration and badge.
- Retains the homepage the team selected while strengthening typography, page spacing, action controls and all secondary workspace sections.
- OLED-black Dark Mode, separate Light Mode and 12 optional accent palettes.
- Five-step onboarding explains the product, radar measurement, the two observation dates and what the differences can and cannot mean.
- A refined floating five-destination mobile navigation with touch-friendly hit areas and a More sheet.
- KUNTAU crest launcher icon and refreshed PWA icon assets.
- Real proportional SVG analytics bars, data labels, KPI values and explanatory copy from the saved analysis.
- Interactive 3D Earth remains touch-enabled; map and raster libraries load on demand.

## Evidence and traceability
- Restores exact source evidence filenames in all application links and data-manifest paths.
- Keeps original NISAR product IDs, dates, acquisition modes, QA reports, QA summaries, metadata and derived previews.
- Preserves the scientific warning: 72.7% lower later / 27.3% higher later is a pixel measurement distribution, not a flood or crop-damage classification.
- Both QA summaries still report an identification-group check failure; the current Kura test footprint is not field-verified.

## Installation and deployment
- Manifest starts at the relative app root; service-worker cache updated to v12 and old caches cleaned up.
- Android guide states the phone must install from the deployed HTTPS site, not the Windows local `127.0.0.1` preview.
- Git publish helper preserves existing repository history, protects `.git` and excludes original GeoTIFF/HDF5 products and credentials.

## Verification limits
JavaScript syntax, local paths, manifest, app-shell cache paths, HTML IDs and CSS brace balance were checked. A real Android-device test and successful Cloudflare deployment still need to be performed by the team.
