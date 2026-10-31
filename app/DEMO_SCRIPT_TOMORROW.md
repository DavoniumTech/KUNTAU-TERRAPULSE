# KUNTAU TERRAPULSE — Tomorrow's live demonstration

## Before the audience arrives

- Keep the original files `Kura_Before_2026-10-08.tif` and `Kura_After_2026-10-20.tif` in `C:\KUNTAU_TERRAPULSE\data`.
- Run `CONNECT_KURA_DATA_AND_START.bat` from the new app folder.
- Keep the black CMD window open.
- In Compare, load both original TIFFs. Confirm both cards say **Loaded** and read the status message.
- Click Explore map and choose **Change overlay** in the map selector.
- Check that the map overlay, Compare canvas and statistics are visible. If not, use the two manual Choose file buttons. Do not present an empty viewer as a working result.
- Download Metadata JSON and Metadata CSV from Data & Methods. After successful loading, export the PNG preview and analysis CSV.

## 3-minute narration

**Problem:** Communities around the Kura River have experienced seasonal overflow and impacts to surrounding land. The question is how satellite radar can help us notice where the surface response has changed and prioritize field checks.

**Method:** We use two NISAR L-band GCOV provisional observations from 8 October and 20 October 2026, cropped to the same small Kura test area. The app reads original Float32 GeoTIFFs locally, checks the grid, compares the shared HHHH layer and shows the difference on the map.

**What the colours mean:** Blue/teal indicates lower later measurement values; amber indicates higher later values. The colours are relative to this pair and are not automatically water or flood classes.

**Limits:** The scenes have different modes (SHSH and DHDH). This pair is exploratory, the test rectangle is not a verified river/floodplain boundary, and this is not a water-level measurement or flood forecast.

**Next work:** Verify the Rafin Kura river channel inside the AOI, review comparability with the GIS lead, add more dates, and compare candidate changes with river-gauge, rainfall, flood-report and field evidence.

## If judges ask “What has the app actually achieved?”

“We have built a local-first PWA that reads the two original georeferenced NISAR-derived GeoTIFFs, checks spatial grid alignment, computes an exploratory pixel difference, visualizes the observations and difference in map context, and exports analysis and metadata. We have not completed a validated water classification or operational flood-warning system yet.”

## Do not claim

- “The river is flooding” unless independently verified.
- “This location is safe/unsafe.”
- “We predict flood levels or river depth.”
- “27.3% of the area flooded” or “72.7% became dry.” Those are not what the pixel statistics mean.
