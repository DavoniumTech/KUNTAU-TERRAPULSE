# KTP DELIVERABLES REVIEW — 31 October 2026

## Overall decision
The local processing bundle is readable and contains georeferenced 8 October, 20 October and exploratory-difference rasters plus previews. The grid alignment check passes. This is **not yet scientifically approved for environmental interpretation**.

## Confirmed from the bundle
- Both clipped rasters: 327 × 332 pixels, EPSG:32632, 20 m grid, identical geotransform and bounds.
- Total cells: 108,564. Alpha-valid cells in each observation: 108,555. Shared valid cells: 108,555.
- The selected common measurement is Frequency A / HHHH.
- 8 Oct product: SHSH; 20 Oct product: DHDH. QA report tables show HH only for the 8 Oct product and HH/HV for the 20 Oct product.
- Both acquisitions are descending, track 123, frame 83, look direction Left. Absolute orbits are 6277 (8 Oct) and 6450 (20 Oct).
- QA summaries: input-open, coordinate-grid metadata cubes, calibration LUTs, data-validity checks and QA-completion rows pass. The aggregate “Passes all identification group checks?” row is FAIL for both products.
- The supplied QA summary CSVs do not identify which individual identification sub-check failed. The report PDFs show product metadata and backscatter images/histograms, but do not expose the failed sub-check detail.

## Critical metadata export issue corrected in this review pack
- The source `KTP_NISAR_GRANULES.csv` in the uploaded bundle contains only `[]` (2 bytes), so it is not a usable CSV.
- In the source details JSON, the `requested_product_id` labels were paired to the opposite product's `properties.fileID`. This review pack corrects the IDs by matching each record to its own `fileID`/`fileName`.
- Use the corrected CSV/JSON/GeoJSON in this folder rather than the faulty source CSV/details pairing.

## Difference-raster interpretation
- Common valid cells: 108,555. Positive differences: 29,603 (27.27%). Negative differences: 78,951 (72.73%). Exact zeros: 1.
- Median delta: −0.047712 (linear gamma-zero). Mean delta: −0.071009.
- Range: −256.123 to +5.431. One extreme negative cell at row 123, column 172 (pixel-centre UTM approx. E 438110 m, N 1302190 m) is far outside the rest of the distribution. The displayed difference image is clipped to the symmetric absolute 98th-percentile range ±0.426512 for legibility, while the Float32 difference GeoTIFF retains the extreme value.
- Because this one extreme pixel affects the mean, use the median and distribution as descriptive summaries, not as a stand-alone environmental conclusion. Do not silently remove the outlier; inspect its source pixel values and QA context first.

## What is and is not supported
Supported: the two clipped raster grids align and the supplied pixels produce a numerical difference layer.
Not supported yet: claims of flood expansion, crop damage, crop health, soil moisture change, river depth or improved/degraded farmland. Radar backscatter may respond to several surface and acquisition factors.

## Remaining checks before integrating as a decision layer
1. Resolve the failed aggregate identification QA rows. The NISAR QA project documentation describes `SUMMARY.csv` as a high-level PASS/FAIL summary, `STATS.h5` as a statistical summary, and `LOG.txt` as the error listing. These two small QA_STATS HDF5 files are about 61 KB and 73 KB according to ASF catalogue size listings; they are not the 1.49 GB / 1.90 GB science HDF5 products. If needed, retrieve only QA_STATS.h5 and the QA log/metadata assets, not the science products.
2. Check the extreme outlier in the source 8 Oct and 20 Oct HH rasters.
3. Confirm area-of-interest clipping and actual river-channel overlap. The existing AOI is a small test rectangle and is not field-verified as the river boundary.
4. Compare acquisition geometry, look direction, orbit, calibration and QA details before selecting any threshold or describing the difference as surface change.
5. Only then use the result in farmer-facing language; present it as a “radar measurement difference” until independently corroborated.

## Visualization review
The source three PNG previews are raw 327 × 332 pixel images with no embedded title, axes, legend or units. This pack supplies labelled, coordinate-aware PNGs with shared before/after display stretch, a colorbar and explicit exploratory caveats. These PNGs are presentation previews; the georeferenced Float32 difference GeoTIFF remains the analysis raster.
