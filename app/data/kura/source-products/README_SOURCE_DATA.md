# Quenta TeraPost — source data status and retrieval

## What is included with this release

- The application and its interactive Earth Intelligence Studio frontend.
- The Kura before/after/change visual previews.
- Catalogue records, product IDs, acquisition dates, granule footprints, processing summary and metadata.
- The two product QA reports, QA summary CSVs, ISO metadata XML, and consolidated QA review files.
- `KTP_DELIVERABLES_BUNDLE.zip` and `KTP_REVIEWED_ASSETS_AND_QA.zip` under `app/data/kura/downloads/`.

## What is NOT included

The original HDF5 source granules were **not** downloaded in the saved metadata-only run. Their catalogue-reported sizes are approximately 1.49 GB and 1.90 GB (about 3.16 GiB total). The original cropped Float32 input files `Kura_Before_2026-10-08.tif` and `Kura_After_2026-10-20.tif` were also not present in the saved upload library.

Do not rename the small `KTP_BEFORE_DISPLAY_ONLY.tif` or `KTP_AFTER_DISPLAY_ONLY.tif` files as source rasters. They contain display-stretched values. `KTP_CHANGE_EXPLORATORY_FLOAT32.tif` is an exploratory derivative, not either original input.

## Download the original HDF5 products

The full ASF download helper is supplied at:

`tools/nisar/GET_KTP_NISAR_METADATA.py`

On Windows, from the extracted release folder, run:

`tools/nisar/DOWNLOAD_KTP_NISAR_SOURCE_HDF5.bat`

It installs `asf_search` for the current Python user, searches the two exact product IDs, asks for an explicit `DOWNLOAD` confirmation, and then prompts for the Earthdata Login credentials interactively (password input is hidden). The script does not embed or save the credentials. The HDF5 files are saved outside the Git repository in:

`%USERPROFILE%\Documents\KTP_NISAR_SOURCE_DATA`

Confirm that at least 4 GB of free disk space and sufficient internet data are available before proceeding. Keep the CMD window open until the download finishes. Do not paste Earthdata credentials into chat, code, `.env`, or GitHub.

The exact product IDs, recorded sizes and direct ASF URLs are in `app/data/kura/source-products/NISAR_SOURCE_PRODUCTS.json`.

## Create the original Float32 GeoTIFF inputs

After retrieving the HDF5 source granules, use ASF's NISAR GCOV/GDAL Snippet Exporter or QGIS/GDAL to subset the same geographic AOI and extract the common `frequencyA/HHHH` measurement layer for both acquisitions. Preserve Float32 values; do not apply a display stretch to analysis inputs. Save the two output files using the expected names shown above. Record the exact HDF5 dataset path, AOI geometry, CRS, transform, nodata, GDAL version and export command in the processing notes. Validate dimensions, grid alignment, calibration, product mode and QA before making pixel-wise comparisons.

The 8 October product is SHSH (HH single-pol), while 20 October is DHDH (HH/HV dual-pol). A common HHHH layer alone does not establish full scientific comparability. The current result remains exploratory; it does not prove crop damage, flooding, river level or water depth.

## GitHub and Cloudflare separation

The public repository should contain application source, small previews, metadata, QA evidence, and the small zipped evidence archives. Keep the original HDF5 granules and source Float32 GeoTIFFs outside the GitHub repository and outside the Cloudflare Pages build. Cloudflare Pages has a 25 MiB per-file static-asset limit; these HDF5 files exceed it by a wide margin. Use a separate data store (such as a properly access-controlled Cloudflare R2 bucket) if the full granules must be served to authorized users.
