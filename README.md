# KUNTAU TERRAPULSE (KTP)

**An evidence-first Earth-observation prototype for exploring changes in river corridors and surrounding land.**

KUNTAU TERRAPULSE is a student-built project exploring how NASA–ISRO NISAR L-band radar observations can help people identify places where the radar response of the Earth's surface has changed between observation dates. The initial study area is a small test footprint near Kura, Kano State, Nigeria.

## What the prototype does

- Presents two dated radar observations for side-by-side or swipe comparison.
- Displays an exploratory pixel-wise difference layer where matching valid pixels are available.
- Provides source and processing information so that users can inspect where the data came from.
- Aims to translate technical Earth-observation evidence into plain-language prompts for further investigation.

## Important scientific status

The current October 8 and October 20, 2026 comparison is **exploratory, not a validated flood, river-stage, crop-health, or damage product**. The two source acquisitions have different acquisition modes (SHSH and DHDH). Their common HH measurement was extracted, and the derived GeoTIFFs have matching grid dimensions, coordinate reference system, pixel spacing and footprint. This geometric alignment does not by itself prove scientific comparability.

The initial raster audit reported 108,555 common alpha-valid pixels. Further review of the source QA diagnostics, acquisition geometry, relevant quality layers, and the extreme difference pixel is required before interpreting the change layer as environmental change. The test footprint has not yet been confirmed to coincide with the river reach discussed in the project use case.

## Repository layout

- `app/` — KTP installable web application/PWA source. Copy the tested front-end project here.
- `docs/` — project brief, science methods, QA notes, demo guide and team documentation.
- `data/catalogue/` — small ASF catalogue metadata exports (CSV, JSON, GeoJSON).
- `data/qa/` — small QA summaries and supporting reports, with source product IDs retained.
- `data/visualizations/` — approved lightweight PNG previews for documentation and demos.
- `data/processed/` — local processed rasters. Large or intermediate files are ignored by Git by default.
- `data/raw/` — original downloaded source data. This folder is deliberately ignored by Git.
- `scripts/` — reproducible local processing and validation scripts.

## Data access and reproducibility

The current working dataset was discovered through NASA's Alaska Satellite Facility (ASF) search services. Catalogue metadata and small supporting assets are stored separately from the large science products. Do not put Earthdata passwords, tokens, `.netrc`, `.dodsrc`, or other authentication material in this repository.

The original HDF5 science products are not included. Do not download or commit them just to use this repository. The extracted GeoTIFFs and local processing outputs remain on the data owner's computer unless a reviewed, appropriately sized derivative is deliberately selected for publication.

## Plain-language user experience goal

A non-specialist should be able to answer four questions:

1. What did the satellite observe?
2. Where did the radar measurement change?
3. What are some possible explanations, and what is still uncertain?
4. What location or information should be checked next?

Technical terms, product IDs, units, processing details and QA status should be available in a separate Science/Data view rather than overwhelming the everyday map user.

## Current project status

This is a research and demonstration prototype. The front end and local data-processing workflow exist. Scientific QA, footprint-to-river verification, final change interpretation, end-to-end app integration, device testing and deployment remain work items. Do not describe it as an operational warning or prediction service.

## Team workflow

Use issues or a shared task board to assign work. Keep changes in feature branches and review before merging to `main`. Record every processing change in `docs/` and preserve original data unchanged.

## Citation and acknowledgements

Credit NASA–ISRO NISAR and the Alaska Satellite Facility (ASF) for the source observations and catalogue services. Include exact product identifiers, acquisition dates, product versions and access date in the project's data manifest. Follow the applicable data-use and attribution terms for every external basemap, imagery source, library and dataset.
