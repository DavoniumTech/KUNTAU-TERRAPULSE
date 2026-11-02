# KUNTAU TERRAPULSE v1.0.0 — Earth Intelligence Studio

**Product:** KUNTAU TERRAPULSE (KTP)  
**Product team:** Quentausas Corp  
**Institutional collaboration:** KUNTAU Science Academy  
**NASA Space Apps Challenge 2026:** Dancing with the SARs · Kano local event

KUNTAU TERRAPULSE brings interactive Earth exploration, satellite radar observations, map layers, comparison tools and plain-language learning into one responsive Progressive Web App. The product is presented for a broad audience, while the included Kura case study shows how a specific observation pair can be explored.

## Included experience

- Interactive 3D Earth and an Explore map workspace.
- NISAR GCOV browse previews for 8 October and 20 October 2026.
- Before/after and exploratory difference views.
- Evidence-led insights, observation metadata, QA reports and learning guides.
- OLED-dark and light appearance modes, accent palettes and a subtle space-doodle wallpaper.
- Fixed bottom navigation on phones and a persistent desktop side rail.
- KTP product mark paired with the KUNTAU Science Academy badge.
- Installable PWA manifest and updated service-worker cache.

## Evidence notes

The supplied Kura comparison summary reports 108,555 common valid pixels: 72.729% had lower later HHHH measurements, 27.270% had higher later measurements, and one was effectively unchanged. Those figures describe radar measurement differences—not percentages of flooded, damaged or healthy land. The 8 October product is SHSH and the 20 October product is DHDH; both QA summaries flag an identification-group check. The 327 × 332 pixel, 20 m extraction footprint is exploratory and is not a surveyed river or floodplain boundary. The source HDF5 granules and original Float32 GeoTIFFs are not bundled in this release.

## Run locally on Windows

1. Extract the ZIP.
2. Open `app` and double-click `START_TERRAPULSE.bat`.
3. The local preview opens on the same computer. The `127.0.0.1` address is not a phone installation address.

## Publish to the existing GitHub repository

Run the single CMD command in `CMD_EXTRACT_AND_PUBLISH.txt`. It extracts this release to the Desktop and starts `PUBLISH_TO_GITHUB_MAIN.bat`. The script checks the existing clone and repository origin, updates only the working tree, excludes source rasters and credentials, shows the changes, and asks you to type `YES` before commit and push. It does not delete or recreate the remote repository.

Cloudflare Pages must already be connected to the GitHub repository's `main` branch for an automatic deployment. Android installation must be performed from the deployed HTTPS address.
