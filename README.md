# KUNTAU TERRAPULSE (KTP)

**KTP Earth Intelligence Studio** is a local-first, installable Earth-observation workspace developed by KUNTAU Science Academy for NASA Space Apps Challenge 2026 — *Dancing with the SARs*.

It helps community members, students and science teams inspect NISAR radar observations, compare two dates and understand why a change signal needs local verification.

## Current demonstration dataset

- Study area: a small Kura test AOI in Kano State, Nigeria. It is **not yet verified against a surveyed River Kura channel or floodplain boundary**.
- Earlier observation: 8 October 2026, NISAR L2 PR GCOV, Frequency A / HHHH, acquisition mode SHSH.
- Later observation: 20 October 2026, NISAR L2 PR GCOV, Frequency A / HHHH, acquisition mode DHDH.
- Grid: 327 × 332 pixels, EPSG:32632, 20 m spacing, 108,555 shared alpha-valid pixels.
- The packaged before/after previews and difference preview are available inside the app. The difference is **exploratory** because the product modes differ and both supplied QA summaries have an unresolved identification-group check failure.

## Run locally (Windows)

1. Extract the repository.
2. Open `app`.
3. Double-click `START_TERRAPULSE.bat`.
4. Keep the terminal window open and open the local address it prints (normally `http://127.0.0.1:8080`).
5. Use **Explore map**, **Compare**, **Insights**, and **Learn & field guide**.

The packaged evidence previews are ready without loading the original GeoTIFFs. To recalculate in the browser, choose the original Float32 GeoTIFFs from your local computer. They are not automatically uploaded.

## People-first learning

- **Farmer & community:** everyday-language explanations and a four-question field-check list.
- **Students & children:** radar echo diagram and a short knowledge quiz.
- **Science team:** product identifiers, grid information, QA state and technical caveats.
- **Guided tour:** a five-step presentation that can be screen-recorded locally.

## Important scientific limits

A radar backscatter difference is not automatically a flood, water mask, crop-health result, water-depth estimate or forecast. Possible drivers include water, wet soil, vegetation, surface roughness, acquisition geometry and processing/quality conditions. The current SHSH/DHDH pair requires additional comparability review. The AOI needs independent geographic verification against the river corridor.

## Privacy and security

- Local server binds to `127.0.0.1` only.
- No account is required for the local demonstration.
- GeoTIFF processing runs in the browser session; the source files are not uploaded by the app.
- Earthdata credentials, `.netrc`, `.dodsrc`, raw HDF5 products and raw GeoTIFFs must never be committed to GitHub.
- The optional Esri World Imagery basemap requires an internet connection and shows provider attribution. Offline coordinate grid is the default.

## Version

v0.7.0 — Earth Intelligence Studio / people-first learning and presentation update.

## Cloudflare Pages deployment (after testing)

This is a static PWA. In Cloudflare Pages, connect the `DavoniumTech/KUNTAU-TERRAPULSE` GitHub repository, set the root directory to `app`, use build command `exit 0`, and set the build output directory to `.`. Use `integration/nisar-data-map` as a preview branch first; keep `main` as the production branch until the preview is verified. The `app/_headers` file defines basic response security headers and prevents stale service-worker/manifest responses.
