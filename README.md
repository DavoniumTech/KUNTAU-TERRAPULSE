# KUNTAU TERRAPULSE — v0.8.1 Interactive Earth Intelligence Studio

**KUNTAU TERRAPULSE** is a team-developed, local-first Progressive Web App from KUNTAU Science Academy for NASA Space Apps Challenge 2026, challenge **“Dancing with the SARs.”** It brings together an interactive 3D Earth overview, a georeferenced NISAR evidence map, before/after comparison, science notes, and audience-friendly learning tools.

## What's new in this release

- **Interactive 3D Earth:** drag to rotate, scroll or use controls to zoom, focus the approximate Kura study area, pause/resume the slow spin, and reset. The textured sphere includes an atmospheric rim, procedural cloud wisps, star field and conceptual satellite-orbit animation.
- **Two primary appearance modes:** Dark Mode and Light Mode.
- **Twelve additional palettes in Settings:** Ocean, Aurora, Emerald, Solar, Amethyst, Rose, Ember, Arctic, Monsoon, Graphite, Sandstone and Cobalt. Palettes work independently with either main mode and are saved in the browser.
- Quality options, reduced-motion support, responsive layout, PWA install support and updated offline caching.
- Team-centred public presentation and KUNTAU Science Academy project credit.
- Retained georeferenced NISAR before/after/change previews, layer controls, swipe comparison, catalogue, analysis metadata, QA records, labelled figures and exports.

**Important distinction:** the 3D globe is an interactive educational overview. It is not a live satellite, live NISAR track, science raster or high-resolution 3D model of Kura. The actual NISAR evidence remains in the Explore map and Compare pages.

## Run on Windows

1. Extract the ZIP to the Desktop or another writable folder.
2. Open the `app` folder.
3. Double-click `START_TERRAPULSE.bat`.
4. Keep the black CMD window open. The browser opens the local URL printed by the server (normally `http://127.0.0.1:8080`).
5. Use Overview, Explore map, Compare, Insights, Learn & field guide, Data & methods and Settings.

Python 3 is required for the local launcher. If it is not installed, use the Python link printed by the launcher. Original source GeoTIFF files are optional for opening the packaged previews. A new pixel comparison can be calculated locally by selecting the original Float32 GeoTIFFs on the Compare page.

## Current science example

The demonstration uses a small Kura test footprint in Kano State, Nigeria, and two provisional NISAR L2 PR GCOV L-band observations:

- 8 October 2026 — SHSH mode.
- 20 October 2026 — DHDH mode.

The common extracted comparison layer is `frequencyA/HHHH`. The included change layer is **exploratory**: the acquisition modes differ, both supplied QA summaries report an unresolved identification-group check failure, and the small test footprint has not been verified against a surveyed river channel/floodplain boundary. A radar difference is not automatically floodwater or crop damage. The app does not measure river depth, river stage, flow rate, crop health or predict floods.

Read `docs/KUNTAU_TERRAPULSE_PROJECT_BRIEF.md` and `docs/KTP_USER_GUIDE_FARMERS_STUDENTS.md` for the evidence, limits and intended workflow.

## GitHub and Cloudflare Pages

See `CMD_PUBLISH_TO_GITHUB_MAIN.txt` and `app/GITHUB_PUBLISH_GUIDE.md` for copy-paste Windows CMD commands. Recommended Cloudflare Pages settings:

- Production branch: `main`
- Root directory: `app`
- Build command: `exit 0`
- Build output directory: `.`

The app is a static PWA; the release does not add a private backend. A successful push to `main` should trigger a deployment automatically if the Pages project is connected to the repository and configured as above.

## Protect source data and credentials

Do **not** publish original `.tif`, `.tiff`, `.h5`, `.hdf5` files or Earthdata credentials (`.netrc`, `_netrc`, `.dodsrc`, `.env`, tokens, private keys). They are intentionally excluded by `.gitignore`. The small packaged PNG previews, catalogue records, QA summaries and metadata are retained for the public demonstration. Check `git status` before every commit.

## Design benchmark

`docs/KTP_DESIGN_BENCHMARK.md` documents the curated review of 25 relevant Earth-observation, GIS, 3D mapping and environmental-monitoring products/libraries. It records the useful interface patterns adapted for KTP without copying third-party branding or making claims about services not integrated here.


## v0.8.1 evidence completeness update

This release adds downloadable full KTP evidence archives, an exact two-product NISAR source manifest, and a Windows helper to retrieve the original HDF5 products directly from ASF using interactive Earthdata authentication. The raw HDF5 granules and original before/after Float32 GeoTIFF inputs are not included because they were not present in the saved uploads. Display-only and exploratory TIFF derivatives remain labelled as such.


## Hosting architecture

This repository is the static HTML/CSS/JavaScript PWA served from `app/`; it is not a Laravel application and contains no PHP runtime, Laravel routes or Blade templates. Cloudflare Pages can host this frontend as static assets. If a true Laravel Blade frontend/backend is required, that is a separate architecture and PHP hosting/runtime decision; it should not be described as part of this static release.
