# KTP project status snapshot

## Already completed

- ASF Vertex discovery of the two selected NISAR GCOV product records.
- Extraction of the common Frequency A HH measurement into two GeoTIFFs.
- Initial grid comparison: both rasters are 327 × 332, EPSG:32632, 20 m pixels, with matching origin and bounds.
- Alpha-mask audit: 108,555 common alpha-valid pixels.
- ASF catalogue metadata exports (CSV, GeoJSON, JSON) retrieved.
- Small supporting assets downloaded: one Frequency A HHHH browse image, ISO XML, QA report PDF and QA summary CSV for each observation.
- Local before, after and exploratory difference visualizations generated.

## Still required before scientific approval

- Inspect the detailed QA summaries and diagnostic information; the high-level QA summary includes an unresolved failed identification-group check.
- Investigate the extreme difference pixel/outlier.
- Verify the two acquisitions are suitable for quantitative comparison despite different acquisition modes (SHSH versus DHDH).
- Verify the test AOI overlaps the river reach being discussed.
- Document processing settings, units, masks and interpretation limitations.

## Selected product identifiers

**2026-10-08:**
`NISAR_L2_PR_GCOV_032_123_D_083_2005_SHSH_A_20261008T175433_20261008T175508_P05023_N_F_J_001`

**2026-10-20:**
`NISAR_L2_PR_GCOV_033_123_D_083_2005_DHDH_A_20261020T175433_20261020T175508_P05023_N_F_J_001`

## Important status wording

Use “exploratory radar-response difference” until scientific comparability and QA are approved. Radar-response differences alone do not prove flooding, river depth, crop health, crop damage, or cause of change.
