# Quenta TeraPost — project brief

**Challenge:** NASA Space Apps Challenge 2026 · Dancing with the SARs  
**Team:** Quenta TeraPost · KUNTAU Science Academy  
**Local Event:** Kano, Nigeria  
**Study area:** Kura test AOI, Kano State, Nigeria  
**Concept:** River-corridor and floodplain observation

## The problem

A report published by The ICIR on 2 March 2024 describes River Kura overflow damaging farms in Kunshama, Kura LGA. Community impact creates a need for better ways to notice and investigate changing water/land conditions around river corridors. The current test raster rectangle is around the Rimin Daddo area and has not yet been verified against the exact reported river reach.

## What TeraPost does today

TeraPost is a local-first Progressive Web App that reads two locally selected NISAR-derived Float32 GeoTIFFs, checks whether their dimensions and spatial grids match, compares their shared HHHH measurement layer, displays a before/after swipe and difference visualization, places the selected raster in geographic map context, and exports exploratory statistics and product metadata.

## What is new about the approach

It translates a technical radar comparison into a visual workflow that a student, GIS analyst or local response team can inspect. It makes the acquisition dates, product IDs, data limitations and need for field verification visible instead of hiding them behind a coloured map.

## Current evidence

Two provisional NISAR L2 PR GCOV L-band observations were cropped to a reported 327 × 332 pixel grid at 20 m spacing: 8 October 2026 (SHSH) and 20 October 2026 (DHDH). The common extracted layer is `frequencyA/HHHH`. An earlier browser test reported 108,555 valid shared pixels, a mean stored-value difference of -0.071009, with 27.3% positive and 72.7% negative pixel differences. These are exploratory statistics, not percentages of flooded or dry area.

## Scientific limits

The source products differ in acquisition mode (SHSH vs DHDH), and a common HH layer does not alone establish full comparability. Radar response may change because of open water, wet soil, vegetation, surface roughness, geometry or acquisition conditions. The app does not measure river depth, river stage, flow rate or predict floods. The test AOI is not a surveyed river centreline or floodplain boundary.

## Next validation steps

1. Verify the exact river reach and floodplain boundary against a trusted GIS layer or field evidence.
2. Have the GIS lead review product metadata, calibration, geometry, quality and mode comparability.
3. Add more matched observations to distinguish temporary changes from persistent/seasonal patterns.
4. Develop and validate a water-extent method against independent references such as gauge data, rainfall, optical imagery, official flood reports and field photographs.

**Project statement:** TeraPost is an evidence-to-investigation prototype—not an operational flood-warning service.
