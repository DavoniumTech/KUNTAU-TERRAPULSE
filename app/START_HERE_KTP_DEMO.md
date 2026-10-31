# KUNTAU TERRAPULSE — KTP local demonstration (v0.5.0)

## One CMD command to launch and open the browser

After extracting the ZIP, open Command Prompt and paste this command (change the folder name only if you extracted it somewhere else):

```bat
cd /d "%USERPROFILE%\Desktop\KUNTAU_TERRAPULSE_V041\KUNTAU_TERRAPULSE_PWA" && OPEN_TERRAPULSE_LOCAL.bat
```

This copies the two original Kura GeoTIFFs from `C:\KUNTAU_TERRAPULSE\data`, starts the local server, and opens your browser. Keep the black CMD window open. The server prints the exact local URL, usually `http://127.0.0.1:8080`. Press Ctrl+C in CMD to stop it.

If you only want to open the app without copying data:

```bat
cd /d "%USERPROFILE%\Desktop\KUNTAU_TERRAPULSE_V041\KUNTAU_TERRAPULSE_PWA" && START_TERRAPULSE.bat
```

If your extracted folder has another name: open that folder in File Explorer, click its address bar, type `cmd`, press Enter, then type `OPEN_TERRAPULSE_LOCAL.bat`.

## What is needed for the demonstration?

- **Before and After:** yes. They are the two original NISAR GeoTIFF observations, 8 Oct and 20 Oct 2026. Without both files the comparison cannot calculate a change layer.
- **Visualization:** yes. The map and before/after/change views help people understand where the raster values differ. The decorative Three.js globe, satellite, stars and moons are interface visuals only—not scientific data.
- **Metadata:** yes. It records the product IDs, dates, area, measurement and limitations so the comparison can be traced and reviewed.
- **Display-only GeoTIFFs:** do not use them for analysis. Use the original Float32 files.

## Science caution

The 8 Oct product is SHSH (HH only) and 20 Oct is DHDH (HH/HV). The common HH layer is selected, but the acquisition-mode difference still needs review. The current Kura rectangle is a test footprint, not a surveyed river boundary. The output is an exploratory radar-change view—not a flood map, river-depth measurement, water-level reading or flood prediction.

## 45-second demo script

“This is KUNTAU TERRAPULSE, our KTP Earth-observation workspace. We load two NISAR L-band GCOV observations from 8 and 20 October 2026 for a small test area in Kura, Kano. The app checks the raster grids, compares the shared HH measurement layer, and displays the spatial pattern of radar-measurement differences. This is an exploratory result, not proof of flooding or a prediction. Our next step is to verify the study footprint against a river and floodplain boundary and compare the radar evidence with rainfall, water and field observations.”


## KTP 3D Space Studio (v0.5.0)

- Full-window Three.js scene: illustrated Earth, orbital paths, NISAR-inspired satellite model, small moons/planets, a sun-like star, 2,600 desktop background stars and drifting particles.
- Responsive rendering is capped to a lighter pixel ratio and 30 FPS on smaller screens to reduce device heat and battery use. Reduced-motion and WebGL fallback modes are supported.
- The 3D scene is decorative only. It is not a live NISAR feed, real satellite position, Earth basemap or scientific visualization. The GIS map and raster layer remain the source of geographic evidence.
- Sticky top workspace bar, fixed side rail on larger screens and fixed bottom navigation on mobile.
- KTP icon refreshed in SVG, 32px, 192px and 512px variants; app manifest and service-worker cache updated.
- Local server binds only to 127.0.0.1 and sends basic browser security headers. This is a local demonstration server, not a public production deployment.

## Start from CMD

Extract the ZIP to `Desktop\KUNTAU_TERRAPULSE_V050`, then run:

```bat
cd /d "%USERPROFILE%\Desktop\KUNTAU_TERRAPULSE_V050\KUNTAU_TERRAPULSE_PWA" && OPEN_TERRAPULSE_LOCAL.bat
```
