# KTP data folder blueprint

- `data/catalogue/`: corrected ASF granule CSV, GeoJSON, granule details JSON, analysis metadata and summary.
- `data/qa/`: combined QA summary/check CSVs and the product-specific small QA reports/ISO metadata records.
- `data/visualizations/`: labelled 8 October, 20 October and exploratory change PNGs.
- `app/data/kura/overlays/`: compact georeferenced RGBA PNGs used by the local app map; display only.
- `app/data/kura/visualizations/`: labelled figures for user-readable previews.
- `app/data/kura/catalogue/`: app-served copies of catalogue/analysis metadata.
- `app/data/kura/qa/`: app-served QA reports, XML and summary CSVs.
- Original HDF5 products and original Float32 GeoTIFFs remain outside GitHub.
