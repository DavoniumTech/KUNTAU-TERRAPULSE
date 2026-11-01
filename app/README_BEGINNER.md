# KUNTAU TERRAPULSE — v0.8.1 demonstration guide

KUNTAU TERRAPULSE is a team-developed, local-first Progressive Web App from KUNTAU Science Academy for NASA Space Apps Challenge 2026, **“Dancing with the SARs.”** This release combines an interactive Three.js Earth overview with a separate georeferenced NISAR evidence workspace.

## What's new in v0.8.0

- True interactive 3D globe: drag to rotate, scroll or use buttons to zoom, focus Kura, pause/resume spin and reset the view. A textured sphere, atmosphere, animated cloud layer and conceptual satellite are rendered in Three.js.
- **Dark Mode and Light Mode** are the two main display modes.
- **12 additional colour palettes** live in Settings: Ocean, Aurora, Emerald, Solar, Amethyst, Rose, Ember, Arctic, Monsoon, Graphite, Sandstone and Cobalt. Each works with either main mode.
- 3D quality settings, reduced-motion support, responsive desktop/mobile layout and PWA caching.
- Team presentation copy and KUNTAU Science Academy credit.

The 3D globe is for orientation and learning. The actual georeferenced NISAR overlays are displayed on the Explore map; the decorative texture and satellite illustration are not live satellite data or a 3D NISAR raster.

## Demonstration focus

The team is exploring a **Kura River / floodplain observation use case**. A 2 March 2024 ICIR report describes River Kura overflow damaging farms in Kunshama, Kura LGA. The current raster rectangle is a test AOI around the Rimin Daddo area; its exact overlap with the reported river reach and floodplain has not yet been verified.

The responsible project claim is:

> Compare satellite radar observations to highlight where the river corridor and surrounding land may have changed, so those locations can be investigated with field evidence.

This app does **not** measure river depth, flow rate or water level; it does not make a flood forecast; and the current difference display is not a validated water mask or flood classification.

## What is included in v0.8.0

- Responsive desktop/mobile PWA workspace.
- New KTP app icon: earthy brown K, blue/green Earth-inspired TP, red pulse line.
- Overview, Explore map, Compare, Insights, Data & Methods, and Settings sections.
- Kura test-AOI outline on a local coordinate canvas; no volunteer map tiles are requested.
- Local GeoTIFF selection using GeoTIFF.js; selected source rasters are processed in the browser and not uploaded by the app.
- Packaged 8 October, 20 October and exploratory difference previews that open without selecting the original rasters.
- Before/after swipe comparison and exploratory pixel-difference visualization.
- Data & Methods portal with downloadable ASF catalogue records, QA reports, ISO metadata, labelled images and analysis summaries.
- **Map layer selector** for the 8 October image, 20 October image, and October 20 minus October 8 difference overlay.
- Raster grid checks before enabling pixel-wise differences.
- Export buttons for change-preview PNG, analysis CSV, metadata JSON and metadata CSV.
- Analysis metadata can be downloaded before local TIFFs are loaded; the export records that packaged previews are available but the original source rasters are not loaded in that browser session.
- PWA manifest, refreshed service-worker cache and Windows launch/data-copy scripts.

Local problem reference: ICIR, “Again, farming community in Kano counts losses as River Kura wreaks havoc” (2 March 2024): https://www.icirnigeria.org/again-farming-community-in-kano-counts-losses-as-river-kura-wreaks-havoc/

## Current observations

- Before: 8 October 2026, NISAR L2 PR GCOV, track 123 / frame 83, descending, SHSH mode, HH single-polarization.
- After: 20 October 2026, NISAR L2 PR GCOV, track 123 / frame 83, descending, DHDH mode, HH/HV dual-polarization.
- Common extracted layer: `frequencyA/HHHH`.
- Reported raster grid: 327 × 332 pixels, EPSG:32632, 20 m pixel spacing, same origin and extent.
- Earlier browser test: 108,555 valid shared pixels; mean stored-value difference -0.071009; 27.3% positive and 72.7% negative differences. These are exploratory measurement statistics, **not** percentages of flooded, dry or affected land.

## Scientific limitations to explain during the demo

1. The two products have different acquisition modes (SHSH and DHDH). Using their shared HHHH layer does not by itself prove that the observations are fully comparable. Al Amin / the GIS reviewer should assess product metadata, calibration, geometry and quality before interpreting the difference.
2. A pixel difference can respond to water, wet soil, vegetation structure, surface roughness, geometry and acquisition conditions. It is not automatically a water/flood signal.
3. The test AOI is not a surveyed river centreline, floodplain boundary or local property boundary.
4. A single 12-day pair cannot establish a seasonal flood trend or predict future flooding.
5. `*_DISPLAY_ONLY.tif` files have transformed values and must never be used for scientific calculations. Load only `Kura_Before_2026-10-08.tif` and `Kura_After_2026-10-20.tif`.
6. Browser display stretches are for visualization; numerical analysis uses the original raster values.
7. The current app checks grid alignment, but does not complete a full scientific comparability validation.

## Windows setup

1. Extract this ZIP into a new folder, for example `%USERPROFILE%\Desktop\KUNTAU_TERRAPULSE_V0.8.0`.
2. Keep the original Float32 TIFFs in `C:\KUNTAU_TERRAPULSE\data`.
3. Open the extracted `KUNTAU_TERRAPULSE_V0.8.0\app` folder.
4. To view packaged previews first, double-click `START_TERRAPULSE.bat`. To copy the original TIFFs for local recalculation, double-click `CONNECT_KURA_DATA_AND_START.bat`.
5. Keep the black CMD server window open. The launcher picks an available local port from 8080–8090 and opens the address printed in that CMD window.
6. Open **Compare** and click **Load copied Kura files**.
7. If the red status says “Failed to fetch”, refresh once while the black server window remains open, then use the two **Choose before file / Choose after file** buttons and select the originals from `C:\KUNTAU_TERRAPULSE\data`.
8. Wait until both file cards say **Loaded** and the comparison status says the grid check passed. Do not present the comparison if either card still says Not loaded.

## Demo sequence (3–4 minutes)

1. **Overview:** explain that TERRAPULSE is a radar evidence workspace for investigating river-corridor and floodplain change.
2. **Explore map:** show the Kura test rectangle. Explain that it is a test footprint, not a surveyed river boundary. After loading data, select Change overlay to show the georeferenced difference image.
3. **Compare:** show Swipe, Before, After, then Change. State that teal indicates lower later values and amber indicates higher later values for this pair only; these are not flood/no-flood labels.
4. **Insights:** explain what radar measures and why field validation matters.
5. **Data & methods:** download Metadata JSON and Metadata CSV. After a successful raster load, also download the change-preview PNG and analysis CSV.

## Suggested 60-second explanation

“KUNTAU TERRAPULSE explores how NISAR radar observations can help communities investigate changes around river corridors and floodplains. We selected a small test area near Kura, Kano State, and prepared two provisional NISAR GCOV observations from 8 and 20 October 2026. The app checks whether the cropped rasters share the same grid, compares their common HH measurement layer, and maps the relative difference so analysts can identify places for further investigation. Radar response can change for several reasons, so this is not yet a flood map or flood prediction. Our next scientific steps are to verify the river footprint, review the different acquisition modes, compare more dates, and validate candidate water changes against gauge, rainfall and field evidence.”

## Keep these files private / out of Git

The `.gitignore` excludes local raster files and Earthdata credentials. Do not upload `.dodsrc`, `.netrc`, HDF5 source files or original GeoTIFFs to a public repository unless you have deliberately reviewed the access and redistribution requirements.


## v0.8.0: Open the included evidence
Open Explore map or Compare: the packaged 8 October, 20 October and exploratory change previews are already included. No NASA download is needed to view them. The local original GeoTIFFs are still required only if you want to recalculate the comparison. Open Data & methods to download the ASF catalogue, QA summaries, ISO metadata and product QA reports.


## v0.8.0 evidence-first workflow

- Open **Explore map** to see the packaged georeferenced before, after or exploratory difference overlay on a local coordinate grid. This screen does not use OpenStreetMap background tiles.
- Open **Compare** to view the packaged previews immediately. The swipe control compares the two date previews; Change shows the exploratory difference figure.
- The file pickers are optional. They read the original Float32 GeoTIFFs locally when a new pixel calculation is required.
- Open **Insights** for the plain-language explanation. It describes measured radar response differences and explicitly says the cause is not known from this pair alone.
- Open **Data & Methods** to inspect product identifiers, acquisition details, QA status and download the figures, metadata, QA CSV/PDF and ISO XML.
- The two QA summaries report an identification-group check failure. The two product modes differ (SHSH vs DHDH). Treat the difference output as exploratory until the QA diagnostics and cross-mode comparability are resolved.
- The local test rectangle has not been field-verified against the Rafin Kura river channel.


## v0.8.0: Learning and presentation

The Learn & field guide page has separate routes for farmers/communities, students/children and science teams. Use the guided tour for a short presentation. The app uses local illustration diagrams; it does not auto-download a video.


## New in v0.8.1 — complete SAR evidence downloads

Open Data & Methods and download the KTP deliverables bundle and reviewed QA package. The source product manifest records the two exact NISAR HDF5 granules and their reported sizes. The original HDF5 products and original before/after Float32 GeoTIFFs are not included in the uploaded archives; do not confuse the DISPLAY_ONLY TIFFs or exploratory difference TIFF with the original source inputs. Use `tools/nisar/DOWNLOAD_KTP_NISAR_SOURCE_HDF5.bat` in the extracted project root to download the HDF5 originals from ASF with an interactive Earthdata Login prompt. Source products are saved under Documents, not into Git.
