# Kura evidence package — KUNTAU TERRAPULSE v0.8.2

This folder contains lightweight, app-facing evidence derived from two local NISAR GCOV HHHH GeoTIFF extractions.

- `overlays/` contains georeferenced PNG previews for the Explore map.
- `visualizations/` contains labelled presentation PNGs.
- `catalogue/` contains corrected ASF catalogue records and saved analysis metadata.
- `qa/` contains the supplied QA reports, ISO metadata and CSV summaries.
- `ktp_data_manifest.json` describes dates, products, map extent, statistics, QA status and limitations.

The original HDF5 products and Float32 GeoTIFF source rasters are not included. The displayed change layer is exploratory because the two observation modes differ (SHSH vs DHDH), both QA summaries report an identification-group check failure, and the test footprint has not been field-verified against the river channel.
