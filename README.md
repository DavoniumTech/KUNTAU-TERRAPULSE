# Quenta TeraPost v0.9.0 — Earth Intelligence Product Studio

**Product:** Quenta TeraPost  
**Product team:** Quentausas Corp  
**Institutional collaboration:** KUNTAU Science Academy  
**NASA Space Apps Challenge 2026:** Dancing with the SARs · Kano, Nigeria

Quenta TeraPost is an evidence-led Earth-observation studio that brings satellite radar observations, georeferenced map previews, comparison tools, quality records and plain-language learning into one responsive installable application.

## What the product does
- Explore an interactive Three.js Earth globe and the Kura test area on a georeferenced map.
- Inspect two packaged NISAR GCOV observations from 8 October and 20 October 2026.
- Compare before/after and exploratory difference layers.
- Read measurement distribution, QA flags and plain-language interpretation notes.
- Export a comparison PNG, analysis CSV and metadata record after suitable source rasters are loaded.
- Install as a PWA on Android from the deployed HTTPS origin.
- Choose Dark or Light mode and 12 optional accent palettes.

## Saved comparison — important limitations
The saved summary reports 108,555 common valid pixels: 72.729% had lower later HHHH measurements, 27.270% had higher later measurements, and one was effectively unchanged. These are pixel measurement differences, not percentages of flooded or damaged land. The 8 October observation is SHSH; the 20 October observation is DHDH. Both QA summaries flag one identification-group check. The 327 × 332 pixel, 20 m Kura rectangle is a test extraction footprint, not a surveyed river/floodplain boundary. Cross-mode comparability and field verification remain open.

## Run locally
Open `app/START_TERRAPULSE.bat` (legacy launcher filename) or run `python run_server.py` from the `app` folder. The local `127.0.0.1` address is only for the computer running the server. Install on a phone from the deployed HTTPS Cloudflare Pages URL.

## Publish to GitHub
Use `PUBLISH_TO_GITHUB_MAIN.bat` after extracting the release. It updates the existing repository clone and requests explicit confirmation before commit and push. Do not commit original GeoTIFF/HDF5 source products or Earthdata credentials.
