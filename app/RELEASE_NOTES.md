# KUNTAU TERRAPULSE — v0.8.0 Interactive Earth Intelligence Studio

## Interface and experience
- Interactive Three.js 3D Earth with Earth texture, rotation by drag, scroll and button zoom, Focus Kura, reset and spin/pause controls.
- Animated clouds, atmospheric rim light, star field, approximate Kura locator and conceptual satellite-orbit animation. This is an educational illustration, not a live NISAR position, orbit or observation.
- Dark and Light are the two primary appearance modes. Twelve additional accent palettes are available in Settings: Ocean, Aurora, Emerald, Solar, Amethyst, Rose, Ember, Arctic, Monsoon, Graphite, Sandstone and Cobalt. Mode and palette preferences persist locally and can be mixed independently.
- Rendering quality control for different device capabilities and reduced-motion support.
- Team-centred public language and KUNTAU Science Academy attribution.

## Science workspace retained
- Kura (Kano State) before/after/exploratory-change previews, georeferenced map overlays, catalogue records, metadata, QA CSVs, source ISO metadata and QA reports.
- Local browser processing of original GeoTIFF files remains optional. Original research rasters and Earthdata credentials are excluded from the distribution and Git.
- Existing swipe, before/after/change, export, data/methods, field guide, guided presentation and offline coordinate grid are retained.

## Important scientific limitation
The 8 October 2026 SHSH and 20 October 2026 DHDH observation pair is still exploratory. Both supplied QA summaries show an unresolved identification-group check failure. The shared HHHH layer does not alone establish full cross-mode comparability. The Kura test footprint is not a surveyed river boundary. This prototype does not classify floods, measure water level/depth/flow or predict hazards.

## Hosting
Static PWA for Cloudflare Pages. Repository root directory: `app`; build command: `exit 0`; build output directory: `.`. Use the `main` branch for production only after local checks.


## v0.8.1 — evidence archive and source retrieval

- Adds in-app download links for both complete available KTP SAR evidence archives.
- Adds exact source-product IDs, dates, reported HDF5 sizes and ASF URLs.
- Adds a Windows helper for authenticated ASF HDF5 downloads; credentials are prompted at runtime and not stored.
- Clearly distinguishes DISPLAY_ONLY TIFFs and the exploratory change Float32 derivative from the original before/after Float32 input rasters.
- Original HDF5 and original before/after Float32 input TIFF files remain absent from this package because they were not present in the saved uploads.
