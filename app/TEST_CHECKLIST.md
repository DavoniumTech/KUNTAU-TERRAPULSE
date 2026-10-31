# KUNTAU TERRAPULSE v0.5.0 — demonstration test checklist

Run these tests in Chrome after launching `CONNECT_KURA_DATA_AND_START.bat`.

## Branding and navigation

- [ ] KTP icon appears in the browser tab; brown K, blue/green TP and red pulse are visible in the mark.
- [ ] Five onboarding screens open on first visit; Skip and Continue work.
- [ ] Overview, Explore map, Compare, Insights, Data & Methods and Settings navigation work.
- [ ] Light/Dark theme toggle and Settings theme choices work.
- [ ] Desktop layout and narrow mobile layout are readable.

## Load the real original data

- [ ] Confirm the two original Float32 TIFFs are in `C:\KUNTAU_TERRAPULSE\data`.
- [ ] Run `CONNECT_KURA_DATA_AND_START.bat`; it copies originals only and launches the local server on an available port.
- [ ] In Compare, click **Load copied Kura files**.
- [ ] If fetch fails, select both files manually using the two file-picker cards.
- [ ] Confirm the before and after cards both say **Loaded**.
- [ ] Confirm the grid check passes (dimensions, CRS where present, extent, origin and resolution).
- [ ] Confirm the SHSH/DHDH comparability warning remains visible.

## Visualization

- [ ] Compare: Swipe, Before, After and Change all display.
- [ ] Explore map: wait for map tiles, then confirm the NISAR overlay appears after files have loaded.
- [ ] Map selector can switch among 8 October, 20 October and Change overlay.
- [ ] Difference legend appears only for the difference layer: lower later / higher later.
- [ ] Do not describe those colours as wet/dry, flood/no-flood or safe/unsafe.

## Exports

- [ ] Data & Methods: Metadata JSON downloads even before any TIFF is loaded.
- [ ] Data & Methods: Metadata CSV downloads even before any TIFF is loaded.
- [ ] After loading both observations, export change-preview PNG and analysis CSV.
- [ ] Confirm exported files appear in Windows Downloads.

## Scientific review still required

- [ ] GIS lead checks the exact river channel / floodplain overlap with the current Rimin Daddo-area AOI.
- [ ] GIS/science lead assesses the SHSH vs DHDH acquisition-mode difference and radiometric comparability.
- [ ] Team does not claim the app measures river stage, depth or flow, or predicts floods.

A successful interface test is not the same as scientific validation.
