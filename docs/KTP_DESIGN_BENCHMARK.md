# Quenta TeraPost — interface and product benchmark (v0.8.0)

## Scope and method

This is a curated design review of 25 relevant public products, documentation sets and open-source mapping libraries across Earth-observation discovery, environmental monitoring, GIS, 3D globes and public-facing science interfaces. It is not a claim that 25 full enterprise applications were independently audited end-to-end or that the team has integrated their services. The benchmark records interaction patterns useful for Quenta TeraPost and how they were adapted for this prototype.

## Reference products and patterns

| Reference | Useful pattern considered | KTP adaptation |
|---|---|---|
| NASA Worldview — https://worldview.earthdata.nasa.gov/ | Layer-first Earth observation, opacity, date controls and rapid visual exploration | Separate map layers and before/after/change comparison, with acquisition dates always visible |
| NASA GIBS — https://www.earthdata.nasa.gov/data/tools/gibs | Standardised global imagery layers and tile services | Keep map evidence georeferenced and distinct from decorative globe texture |
| NASA Earthdata Search — https://search.earthdata.nasa.gov/ | Dataset discovery, spatial/time filters and metadata | Show product IDs, dates and catalogue metadata in the data/methods workspace |
| Copernicus Browser — https://browser.dataspace.copernicus.eu/ | Time-aware imagery selection and visual comparison | Retain date context and clear comparison modes |
| Sentinel Hub EO Browser — https://www.sentinel-hub.com/explore/eobrowser/ | Education-friendly index/imagery explanations and guided use | Farmer/community, student and science-team explanations; no specialist GIS knowledge assumed for the first path |
| CesiumJS — https://cesium.com/platform/cesiumjs/ | True 3D globe, camera controls, globe-scale scene composition | Use a directly manipulable Three.js sphere for this compact self-contained hero; do not claim Cesium terrain/data services |
| MapLibre GL JS — https://maplibre.org/maplibre-gl-js/docs/ | WebGL mapping, globe projection and interactive camera behaviours | Use drag, zoom and focus interaction; keep the science map as a separate georeferenced map |
| Mapbox GL JS — https://docs.mapbox.com/mapbox-gl-js/ | Polished map UI, responsive camera controls and layer styling | Compact tool controls and a responsive map-first experience; no Mapbox account/API key required for current grid view |
| Leaflet — https://leafletjs.com/ | Lightweight map interaction and overlays | Continue to use Leaflet for the 2D scientific workspace and raster overlays |
| OpenLayers — https://openlayers.org/ | GIS-oriented projections, layers and raster/vector support | Keep projection, extent and layer metadata visible for technical review |
| deck.gl — https://deck.gl/ | GPU-accelerated data layers and visual exploration | Reserve a future extension path for dense overlays; do not add unnecessary data payloads now |
| ArcGIS Earth — https://www.esri.com/en-us/arcgis/products/arcgis-earth/overview | 2D/3D geographic exploration | Separate the global 3D orientation view from the 2D measurement map |
| ArcGIS Map Viewer / Time Slider — https://www.esri.com/arcgis-blog/products/arcgis-online/mapping/time-slider-in-map-viewer | Time-enabled layer navigation | Make observation dates and comparison states explicit; no unverified continuous time series is implied |
| Google Earth Engine Apps — https://developers.google.com/earth-engine/guides/apps | Application-specific scientific workflows | Keep KTP's interface task-focused around a defined test area and selected observations |
| Global Forest Watch — https://www.globalforestwatch.org/ | Public environmental indicators, map layers and time context | Explain the map in plain language and connect highlighted locations with local field checks |
| EOSDA Crop Monitoring — https://eos.com/products/crop-monitoring/ | Farm-oriented map layers, field context and trend presentation | Keep agriculture/community use cases understandable, but do not label current radar differences as crop health |
| Planet Explorer — https://www.planet.com/products/planet-explorer/ | Browse imagery by date and inspect/change views | Preserve observation provenance and easy before/after comparison |
| Earth Nullschool — https://earth.nullschool.net/ | Immersive rotating global display with intuitive data-oriented interaction | Adopt the interactive 3D globe feel; avoid implying live weather or real-time NISAR feeds |
| Windy — https://www.windy.com/ | Discoverable overlay menu and timeline-style data navigation | Use named, organised layer controls and simple legends |
| NOAA nowCOAST — https://nowcoast.noaa.gov/ | Multi-layer environmental context and time-aware map tools | Distinguish source observations from interpretation and include a clear method/limitations panel |
| Google Flood Hub — https://sites.research.google/floods/ | Public-facing flood information with clear geographic context | Present evidence cautiously, with clear warnings; KTP is not a flood forecast service |
| USGS EarthExplorer — https://earthexplorer.usgs.gov/ | Search by geography/date and inspect downloadable scene information | Show product metadata, scene dates and identifiers alongside visual evidence |
| NASA FIRMS — https://firms.modaps.eosdis.nasa.gov/ | Event-oriented map layers and explicit data provenance | Keep source/date provenance and layer meaning close to map controls |
| OpenTopography — https://opentopography.org/ | Access to terrain datasets and elevation context | Reserve terrain/elevation layers for a future validated data product rather than fabricating a 3D floodplain surface |
| MapBiomas — https://mapbiomas.org/ | Long-term land-cover monitoring and clear class legends | Make legend interpretation central and explain that two dates cannot establish a seasonal trend |

## Design decisions carried into v0.8.0

1. **Genuine 3D, with honest semantics.** The home-page Earth is a textured Three.js sphere that can be rotated, zoomed, focused on the approximate Kura coordinates and paused. Its clouds, stars, satellite and orbit are illustrations. No raster values are draped onto a fake globe, and no live telemetry is claimed.
2. **Two primary modes, twelve accent collections.** Dark and Light control the full page surface treatment. The twelve palettes modify accents independently and are persisted in local browser storage.
3. **A scientific map remains 2D and georeferenced.** Leaflet continues to show the actual prepared NISAR preview overlays with coordinate context, opacity/layer controls and comparison views. The 3D hero does not replace this.
4. **Date and provenance stay visible.** Dates, product identifiers, acquisition modes, QA notes and method caveats remain accessible rather than being hidden behind visual effects.
5. **Progressive disclosure.** Everyday-language guidance and farmer/community pathways coexist with technical metadata and QA material for the science/GIS audience.
6. **Low-data and device awareness.** The local grid remains the default; satellite basemap tiles are optional. The globe uses a bundled texture, user-selectable rendering quality, responsive controls and reduced-motion behaviour.
7. **Evidence before claims.** Colour changes are radar-response differences, not flood, water-depth, river-stage or crop-health labels. The current two-date pair remains exploratory.

## What has deliberately not been copied or integrated

- No third-party logo, brand layout or proprietary interface code is reproduced.
- No external commercial imagery account, API token, cloud backend or map service is assumed for the default workspace.
- No 3D terrain or inundation surface is fabricated from the two test images.
- No current service is presented as a source of live NISAR status/telemetry.
- The app does not infer crop health, flood probability or water levels from this difference preview.

## Future interface ideas (only after science validation)

- Add a date timeline when a genuinely comparable multi-date series is available.
- Add optional trusted layers (rainfall, river gauge, validated water mask and surveyed channel boundaries) with source/date attribution.
- Add farm-field outlines and farmer-specific reporting only with verified boundaries and an ethical consent process.
- Consider terrain or 3D map tilting only when a trusted DEM/terrain service is integrated and properly attributed.
