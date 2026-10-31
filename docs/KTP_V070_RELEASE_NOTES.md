# KTP v0.7.0 — Earth Intelligence Studio

## What changed

- Reframed the experience as a people-first Earth-observation studio, retaining the local NISAR evidence and scientific caveats.
- Added a compact Blue Marble-style local Earth texture, a more detailed Three.js Earth stage, stylised NISAR-inspired satellite models, orbiting moons/planets, asteroid-like objects, drifting dust and instanced 3D motes.
- Added device-aware 3D quality settings: Auto, Cinematic, Balanced and Lite. The 3D scene is decorative and is not live satellite tracking.
- Replaced remote editorial images in the learning/onboarding path with bundled KTP vector illustrations to reduce repeated mobile-data use and prevent missing third-party photos.
- Added three learning paths: Farmer & Community, Students & Children (with quiz), and Science Team.
- Added a five-step guided presentation which can be screen-recorded locally instead of embedding a large autoplay video.
- Added an optional Esri World Imagery basemap with attribution. Offline coordinate grid remains the default; selecting satellite imagery uses internet data.
- Added better map attribution display, mobile navigation sizing, focus states, learning layouts, glossary and accessible tour modal.
- Updated the service-worker cache and PWA manifest to v0.7.0.

## Retained from v0.6.0

- Packaged 8 October and 20 October Frequency-A HHHH radar previews and the exploratory change layer.
- Catalogue metadata, QA summaries, QA report PDFs and ISO metadata files.
- Local Float32 GeoTIFF selection and in-browser recalculation path.
- Farmer-friendly interpretation warnings and source/data download controls.

## Scientific status

- Both rasters share a 327 × 332 grid, EPSG:32632, 20 m spacing and 108,555 common alpha-valid pixels.
- The observations are different acquisition modes: 8 October SHSH and 20 October DHDH.
- Both QA summaries report an unresolved identification-group check failure.
- The exact AOI overlap with the River Kura channel/floodplain is not verified.
- The pixel-wise difference remains exploratory; no flood, crop-damage, water-depth or river-level diagnosis is produced.

## Data use and privacy

No HDF5 download is needed to run this version. The app package includes small previews and metadata/QA assets. Original GeoTIFFs remain local and are only read when selected. The standard map background is offline; optional Esri imagery uses internet data and must retain its attribution.
