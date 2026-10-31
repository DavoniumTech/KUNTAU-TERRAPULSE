# KTP Geo-folder blueprint

This is the folder arrangement for keeping the application, source records, quality evidence and visual outputs separate.

```text
KUNTAU-TERRAPULSE/
├── app/                         # Tested KTP front-end/PWA source
├── docs/                        # README, science methods, QA and user guide
├── data/
│   ├── catalogue/                # ASF CSV, JSON and GeoJSON metadata
│   ├── qa/                       # QA summary CSVs and small QA reports
│   ├── visualizations/           # Selected before/after/change preview PNGs
│   ├── processed/                # Local GeoTIFF outputs (Git-ignored)
│   └── raw/                      # Original data (Git-ignored)
└── scripts/                      # Local processing/validation scripts
```

## Publication rules

- Keep original HDF5 products, raw GeoTIFFs and intermediate rasters outside Git unless the team has explicitly reviewed a small derivative for publication.
- Publish only selected lightweight preview PNGs and small metadata/QA files after checking provenance, contents and licensing.
- Never publish Earthdata credentials, `.netrc`, `.dodsrc`, access tokens or personal login logs.
- Use the exact NISAR product identifiers in the metadata manifest.
- Do not label the current comparison as a flood map, crop-health map or validated environmental-change product. The acquisition modes differ (SHSH and DHDH), and QA/comparability work remains open.
