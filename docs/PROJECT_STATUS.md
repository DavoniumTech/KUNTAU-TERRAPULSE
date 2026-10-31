# KTP project status — v0.6.0

## Completed
- NISAR ASF discovery for 8 Oct 2026 and 20 Oct 2026 GCOV products.
- Cropped local Float32 GeoTIFFs extracted from the shared Frequency-A HHHH measurement.
- Initial grid audit: 327 × 332, EPSG:32632, 20 m pixels, common alpha-valid pixels 108,555.
- Local before, after and exploratory difference raster/PNG previews produced.
- ASF catalogue metadata and selected small QA/ISO assets retrieved without downloading full HDF5 science products.
- Packaged georeferenced raster preview overlays and metadata in KTP v0.6.0.

## Open scientific checks
- Both QA summaries report failure of the identification-group check. The summary CSV does not reveal the exact diagnostic cause.
- Product modes differ (SHSH vs DHDH); shared HHHH use does not by itself validate cross-mode comparison.
- Extreme negative difference pixel (-256.123) is retained and needs diagnostic review.
- Test AOI overlap with the Rafin Kura channel is not field-verified.

## Current interpretation
The outputs show differences in measured HH radar return in the two-date Kura test extraction. They do not classify flood water, flood damage, crop health, river stage or water depth.

## Next work
1. Diagnose QA identification-group failures from QA report details/logs or supported product diagnostics.
2. Examine the extreme difference pixel and source pixel values/quality context.
3. Verify the footprint against an authoritative river/watercourse layer or field coordinates.
4. After scientific review, refine thresholds and publish interpretation rules.
5. Expand Simple View and Science View based on user tests.
