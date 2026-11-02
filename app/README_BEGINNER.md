# KUNTAU TERRAPULSE v1.0.0 — beginner guide

KUNTAU TERRAPULSE is a mobile-first Earth Intelligence Studio developed by Quentausas Corp in collaboration with KUNTAU Science Academy for NASA Space Apps 2026, challenge **Dancing with the SARs**.

## What is in the studio?

- Interactive Three.js 3D Earth with drag rotation, zoom, Focus Kura, atmosphere, cloud layer and a conceptual orbiting satellite.
- Dark Mode and Light Mode as the main appearance choices, plus twelve accent palettes in Settings.
- Home dashboard, Explore map, Compare, Insights, Learn & field guide, Data & methods and Settings.
- A fixed five-item phone navigation bar with four primary areas and a More sheet for the other sections.
- Kura test-area before/after/change previews, product catalogue, metadata, QA reports and ISO XML records.
- Before/after swipe, change preview and a PNG export; the Insights chart reports the supplied lower/higher radar-measurement pixel shares.
- Mobile-first onboarding, offline app-shell caching and responsive controls.

## Install on a phone

Install the PWA only from the live HTTPS Cloudflare Pages/custom-domain website. Do not install it from the Windows local preview `http://127.0.0.1:8080`; that address points to the computer and cannot be opened by a separate phone. Remove an older icon after deployment and install again from Chrome on the phone. See `INSTALL_ON_ANDROID.md`.

## Open the local preview on Windows

1. Extract the release ZIP on the computer.
2. Open `app` and double-click `START_TERRAPULSE.bat`, or run it from CMD.
3. Keep the black CMD window open. The app opens in the computer's browser at `http://127.0.0.1:8080`.
4. Press Ctrl+C in CMD to stop the local server.

This local address is for computer testing only. It is not a phone installation address.

## Understand the current observations

The packaged pair is **8 October 2026** (SHSH) and **20 October 2026** (DHDH), twelve days apart. The comparison shows the common HHHH measurement layer. The 8 October and 20 October products have different acquisition modes, and both supplied QA summaries report an unresolved identification-group check failure. These results remain exploratory.

A lower or higher radar response is not automatically water, flood, wet soil, crop damage or crop health. Radar response can change because of surface moisture, vegetation, roughness, viewing geometry and other conditions. The Kura test rectangle is not a surveyed river centreline or floodplain boundary. Field checks and independent data are required before making a local claim.

## Load original GeoTIFF files (desktop workflow)

1. Use the original Float32 GeoTIFFs, not any `*_DISPLAY_ONLY.tif` display copy.
2. Select the two files on the Compare page. The browser reads the files locally; they are not uploaded to a TERRAPULSE server.
3. If the original files are not available, the packaged previews can still be viewed and explored, but they cannot be used to recalculate the original pixel comparison.
4. Do not commit source `.tif`, `.tiff`, `.h5`, `.hdf5` files or Earthdata credentials to public GitHub.

## Export a change preview

Open **Compare** and choose **Export change preview PNG**. The PNG is a visual preview that can be placed in a report or presentation. The accompanying metadata and CSV describe the source products and the exploratory calculation. Do not describe the preview as a verified flood map or crop-damage classification.

## What is a radar observation?

- **NISAR:** NASA–ISRO Synthetic Aperture Radar, a satellite mission that measures Earth's surface using radar signals.
- **SAR:** synthetic aperture radar. It can collect observations at night and through many cloud conditions.
- **Backscatter:** the radar energy returned from a surface. Different surfaces and conditions can change the strength of the return.
- **Pixel:** one grid cell in a digital raster map.
- **Field check:** a visit or trusted local observation used to test what a satellite signal might mean.

## Visual context

The home page uses bundled illustrative Earth and landscape artwork to introduce the product. These visuals are not live satellite imagery. The NISAR observation previews are identified separately in the Explore, Compare and Data & methods sections. See `IMAGE_CREDITS.md` for visual sources and credits.
