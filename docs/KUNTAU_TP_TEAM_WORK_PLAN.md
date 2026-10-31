# KUNTAU TP — Team Work Plan for the October Observations

## Shared objective

Determine whether the 8 October and 20 October 2026 NISAR GCOV observations can support a defensible comparison over the Kura, Kano test area. Explain the result in ordinary language. Do not turn radar differences into claims about crop health, crop damage, flooding, or irrigation need without independent evidence.

## Roles and deliverables

### Dawud — Team lead and application
- Keep the science status labelled **Awaiting validation** until the GIS review is complete.
- Maintain the shared Drive folder and collect the reports listed below.
- Update the application wording only after the data team agrees on the evidence and limitations.

### Al Amin — GIS/QGIS lead
- Inspect both source rasters and metadata.
- Verify CRS, pixel size, dimensions, bounds, alignment, units, scaling/calibration, acquisition geometry, masks, and quality layers.
- Check the number-of-looks information and valid-pixel overlap.
- Make a difference raster only if the review supports a comparison; document the exact expression, masking, and processing steps.
- Deliver: QGIS project, metadata/quality comparison, separate date previews, optional qualified difference preview, and a one-page conclusion.

### Shuaib — Data inventory and metadata
- Record the exact product identifiers, acquisition times, processing versions, polarization channels, product modes, units, and source files.
- Check that the GIS report uses the same product IDs as the inventory.
- Deliver: completed `metadata_comparison.csv` and a list of missing metadata.

### Imran — SAR science explanation
- Explain SAR, L-band, HH/HV, GCOV, masks, and measurement limitations in beginner-friendly language.
- Explain why different radar returns can result from several surface and acquisition factors.
- Deliver: a one-page scientific explanation and a glossary of terms.

### Aisha — Agricultural use case
- Interview or consult people familiar with local farming needs, if feasible.
- Identify what decision a farmer might make and what independent evidence is needed before supporting that decision (e.g. field observations, rainfall records, crop calendar, local extension guidance).
- Deliver: one specific farmer question, the evidence needed, and the risk of a misleading answer.

### Husna — User testing and documentation
- Ask at least two people unfamiliar with SAR to read the page and explain it back in their own words.
- Note every confusing label, number, colour, and button.
- Deliver: a short usability report with screenshots and suggested wording changes.

## Required joint decision

Al Amin, Shuaib, and Imran should agree on one of these labels:

1. **Comparable for a stated analysis** — specify the exact channel and conditions; this is not a claim about crop health.
2. **Comparable with limitations** — state the limitations and restrict the interpretation.
3. **Not sufficiently comparable** — do not publish the difference as a change result.
4. **Insufficient evidence to decide** — list the additional checks/data required.

Do not choose a label merely because the images line up visually.

## Shared Drive folder structure

```text
KUNTAU_TERRAPULSE_2026/
  01_source_inventory/
  02_metadata_and_quality/
  03_qgis_project/
  04_separate_observation_previews/
  05_difference_preview_if_approved/
  06_science_explanation/
  07_farmer_research/
  08_user_testing/
  09_final_decision/
```

## Definition of done

The team can explain in plain language what was measured, what was compared, what passed quality checks, what remains uncertain, and what a farmer should **not** conclude from the result.
