# KTP v0.6.0 release notes

This is the first NISAR evidence-integration release. It makes the existing, locally processed observations visible without requiring users to browse for or download science files.

### Included
- Offline coordinate canvas and georeferenced before/after/change map overlays.
- Packaged swipe comparison preview.
- Plain-language explanation for non-specialists.
- Data portal with actual ASF product details, QA status, source downloads and analysis files.
- Updated service-worker cache for packaged evidence.

### Not claimed
- The app is not a flood prediction system.
- The app does not calculate river depth, water level, flow rate or crop health.
- QA approval and cross-mode scientific comparability are not complete.


## v0.6.0 integration notes
- Explore map no longer requests OpenStreetMap volunteer tile-server tiles; it uses a local coordinate grid and packaged georeferenced raster previews.
- Compare opens with packaged before/after/change previews before local source GeoTIFFs are selected.
- Simple View wording and Science/Data & Methods records distinguish previews from locally loaded Float32 rasters.
- Analysis JSON/CSV exports now include saved manifest comparison and QA caveats when original GeoTIFFs are not loaded in the browser.
- Data & Methods provides download links for all three labelled figures, manifest, analysis summary, ASF catalogue records, QA summaries, source QA reports and ISO metadata.
- Scientific status remains exploratory; no flood/water/crop diagnosis is claimed.
