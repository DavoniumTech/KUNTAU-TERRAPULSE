# KTP interface design references

This document records public interface patterns reviewed during the v0.7.0 redesign. KTP uses the ideas as design references; it does not copy third-party branding or claim the same data coverage.

## NASA Worldview

Reference: https://worldview.earthdata.nasa.gov/

Pattern observed: map-first layer selection and tools for comparing imagery. KTP adaptation: a dedicated radar-layer selector and a swipe/before/after/change viewer. KTP has two packaged observations, not Worldview's large operational layer catalogue.

## Copernicus Browser

Reference: https://browser.dataspace.copernicus.eu/

Pattern observed: data/layer selection, date context and split/opacity comparison. KTP adaptation: visible acquisition dates, comparison modes and layer choice. KTP's current observation pair remains a small test example.

## Sentinel Hub EO Browser — Education Mode

Reference: https://www.sentinel-hub.com/explore/eobrowser/user-guide/

Pattern observed: an education-friendly explanation path for people learning Earth observation. KTP adaptation: separate Farmer & Community, Students & Children, and Science Team paths with simple wording, diagrams and a quiz.

## OpenStreetMap tile policy and map providers

Reference: https://operations.osmfoundation.org/policies/tiles/

The standard OSM tile service has a usage policy and may block non-compliant use. KTP therefore defaults to a local coordinate grid and does not assume that the public OSM tile server is an unlimited basemap API.

## Esri World Imagery attribution

Reference: https://www.esri.com/arcgis-blog/products/arcgis-online/mapping/world-imagery-updates

KTP provides an optional Esri World Imagery tile background. The map footer displays provider attribution. It is optional because it requires an internet connection and may consume mobile data.

## NASA Earth imagery reference

Reference: https://svs.gsfc.nasa.gov/3615/

KTP's compact Earth texture is used as decorative space-studio art; it is not a scientific observation of the Kura study area. Credits in the app identify this distinction.

## Design principles for KTP

- Put the observation dates and layer meaning beside the map.
- Offer a simple path for community members and a technical path for analysts.
- Explain that colours are measurement values, not hazard labels.
- Keep the offline map grid as the default for low-data use.
- Keep the 3D background decorative and separate from scientific map layers.
- Respect reduced-motion preferences and provide lighter rendering on phones.
