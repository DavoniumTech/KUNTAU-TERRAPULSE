# KUNTAU TERRAPULSE — v0.8.2 local demonstration

## Start the application in Windows CMD

After extracting the ZIP to the Desktop, open CMD and run:

```bat
cd /d "%USERPROFILE%\Desktop\KUNTAU_TERRAPULSE_V0.8.2_MOBILE_STUDIO\app" && START_TERRAPULSE.bat
```

Python 3 is required for the local server. Keep the black CMD window open while using the application. The launcher opens the address printed in that window, normally `http://127.0.0.1:8080`. Press Ctrl+C in CMD when the session is finished.

The two packaged NISAR preview images and their catalogue/QA evidence are already included, so the Overview, Explore, Compare and Data & methods pages can be demonstrated without downloading source data.

## Connect the original GeoTIFFs (optional)

Original Float32 GeoTIFFs are only needed for a fresh local pixel calculation. They are not required to view the packaged previews.

1. Keep the two original source files in a private folder, using these expected filenames:
   - `Kura_Before_2026-10-08.tif`
   - `Kura_After_2026-10-20.tif`
2. Double-click `CONNECT_KURA_DATA_AND_START.bat`. If the default folder is not found, enter the folder path when requested.
3. The batch file copies the originals into the app's local `data` folder, which is excluded from Git by the root `.gitignore`.
4. On the Compare page, choose **Load copied Kura files**. Alternatively, choose the two original files directly using the file pickers.
5. Wait for both file cards to show **Loaded** and review the grid-alignment status before interpreting a new difference.

Do not use display-only transformed GeoTIFFs for scientific calculations. Use the original Float32 source files.

## What the 3D Earth does — and does not do

The home-page globe is a genuine interactive Three.js sphere with drag-to-rotate, zoom, Focus Kura, pause/resume and reset controls. The bundled Earth texture, atmosphere, cloud wisps, star field and animated satellite are visual orientation elements. The satellite path is conceptual, not a live NISAR position or actual orbit. The Kura marker is an approximate location.

The actual georeferenced NISAR preview rasters are shown on the **Explore map** and **Compare** pages. Do not interpret the 3D decorative globe as a NISAR data layer or as a 3D flood simulation.

## Quick presentation sequence (3–4 minutes)

1. **Overview:** introduce KUNTAU TERRAPULSE as a KUNTAU Science Academy team-built Earth-observation workspace. Rotate the globe, use Focus Kura and show the controls.
2. **Explore map:** show the georeferenced before, after and exploratory change overlays. Explain that the footprint is a test AOI, not a surveyed river boundary.
3. **Compare:** demonstrate Before, After, Swipe and Change. State that the colours describe radar measurement values, not flood/no-flood labels.
4. **Insights:** explain that radar returns can respond to water, wet soil, vegetation, roughness and acquisition conditions.
5. **Data & methods:** show the source product IDs, acquisition dates/modes, QA status and downloadable catalogue/metadata/QA evidence.
6. **Settings:** switch Dark/Light and select any of the 12 accent palettes.

## 45-second project explanation

“KUNTAU TERRAPULSE is a team-developed Earth-observation workspace from KUNTAU Science Academy for NASA Space Apps Challenge 2026, Dancing with the SARs. The demonstration uses two provisional NISAR L-band GCOV observations from 8 and 20 October 2026 for a small test area near Kura, Kano State. The application displays the georeferenced radar previews, compares the shared HH measurement layer and records the product metadata and quality checks. The visible difference is exploratory: the acquisition modes are different, the supplied QA summaries have an unresolved identification-group check, and the test footprint has not yet been verified against a surveyed river channel. The result is a prompt for further investigation, not a flood map, water-level reading or forecast.”

## Important science limits

- The 8 October product is SHSH (HH) and the 20 October product is DHDH (HH/HV). A shared HHHH measurement does not alone establish full cross-mode comparability.
- Both QA summaries report an identification-group check failure. Review the detailed QA PDFs and metadata with the GIS/science team.
- The current Kura test footprint is not field-verified against the Rafin Kura river channel or floodplain boundary.
- A 12-day two-image pair cannot establish a seasonal trend.
- The app does not measure river depth, stage, flow, crop health or future flood probability.
- Validate any candidate change with independent imagery, rainfall/gauge records and local field observations.
