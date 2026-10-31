# QGIS Beginner Guide — Reviewing the 8 and 20 October NISAR Observations

This is a guided inspection, not a promise that the two products are comparable. Al Amin should lead the GIS work while the others follow and record the findings.

## Before opening QGIS

You need the original downloaded NISAR product files for both dates, their metadata/annotation files, and the product documentation. Do not use screenshots as the source data. Do not download the products again unless the original files are missing or incomplete.

Known records from the team's inventory:

- 8 October 2026, 17:54:33 UTC — GCOV, SHSH, HH.
- 20 October 2026, 17:54:33 UTC — GCOV, DHDH, HH and HV.
- The HH channel is present in both products, but that alone does not establish comparability.

The exact product IDs are in the team's data inventory. Confirm them from the original metadata before processing.

## Part A — Make a safe QGIS project

1. Open QGIS.
2. Choose **Project → Save As** and save a new project as `KUNTAU_TP_October_Comparison_Review.qgz` inside the shared project folder.
3. Add the actual HH raster from the 8 October product using **Layer → Add Layer → Add Raster Layer**.
4. Repeat for the HH raster from the 20 October product.
5. Rename the layers clearly in the Layers panel, including the date and product ID suffix. Do not call one layer “before” and the other “after” until the metadata has been checked.
6. Add any valid-data mask, quality layer, and number-of-looks layer supplied with each product. Do not assume every product has identical layer names.
7. Save the project.

## Part B — Compare metadata before comparing pixel values

For each HH layer, right-click the layer → **Properties → Information** and record:

- CRS / coordinate reference system;
- raster width and height;
- pixel size;
- extent / bounds;
- band count and data type;
- NoData value;
- minimum/maximum and units, where the product documentation defines them.

Then inspect each product's metadata/annotation files and record:

- acquisition time and orbit/pass/track/frame details;
- acquisition mode / polarization configuration;
- product version and processing information;
- radiometric quantity and units;
- calibration or scaling information;
- incidence/look geometry information that is available;
- quality flags and masks.

**Important:** same CRS, dimensions, extent, and pixel size establish geometric alignment only. They do not prove radiometric or scientific comparability.

## Part C — Check spatial alignment

1. Use the QGIS Identify tool to inspect the same sample locations in both HH rasters.
2. Confirm that the raster grids overlap and that pixel centres line up. If they do not, record the issue; do not resample automatically just to make the images look alike.
3. Record any clipping, reprojection, resampling, or georeferencing performed. Keep the original source layers unchanged.
4. If a common grid is required, the GIS lead must choose and document a defensible method and explain why it is appropriate for these products.

## Part D — Check masks and valid-data overlap

1. Display the supplied valid-data masks and quality layers separately for each date.
2. Identify which pixels are valid in **both** observations.
3. Do not treat NoData, invalid pixels, low-quality pixels, or masked areas as zero measurements.
4. If you create an intersection mask, document the exact rule and how many pixels remain valid.
5. Review the number-of-looks information and any quality flags. Explain whether the two observations have materially different quality or sampling conditions.

## Part E — Only calculate a difference if the checks support it

Do not subtract two raw arrays just because QGIS Raster Calculator permits it.

Before calculating a difference, the GIS lead and science reviewer must confirm that:

- the same physical quantity and compatible units are being compared;
- calibration/scaling treatment is understood and consistent;
- the common channel is appropriate for the intended comparison;
- geometric alignment is adequate;
- quality masks and common valid pixels are applied correctly;
- acquisition geometry and processing differences do not invalidate the intended interpretation.

If all checks support a limited comparison, use Raster Calculator with the approved layers and common-valid mask. The exact expression depends on the actual layer names, units, and approved mask; record it in the QGIS project notes. Do not copy an expression from another project without verifying it.

If the checks do not support a difference, keep the observations separate and mark the difference layer **not approved for interpretation**.

## Part F — Create honest outputs

Save:

1. `observation_2026-10-08_HH.png` — first date, with date, channel, units, and legend.
2. `observation_2026-10-20_HH.png` — second date, with date, channel, units, and legend.
3. `difference_exploratory.png` — only if approved for a stated comparison; otherwise do not create a public-facing difference map.
4. `metadata_comparison.csv` — completed from the template.
5. `quality_checks.csv` — completed from the template.
6. `KUNTAU_TP_October_Comparison_Review.qgz` — saved QGIS project.
7. A one-page written conclusion with one of the four outcomes in the team work plan.

## What beginners should say when they need help

- “I can see a difference in the display, but I do not yet know whether the measurement is comparable.”
- “I need to check the product metadata and quality mask before interpreting this pixel.”
- “A radar return is not a direct photograph of a crop and is not, by itself, a crop-health diagnosis.”

Do not invent values, fill missing metadata by guessing, or report a farmer recommendation from the difference image alone.
