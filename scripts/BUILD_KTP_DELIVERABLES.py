#!/usr/bin/env python3
"""Build KUNTAU TERRAPULSE local NISAR demonstration deliverables.

Uses only local GeoTIFFs + already-downloaded small ASF companion assets.
NEVER connects to the internet and NEVER downloads HDF5 science products.
Requires OSGeo4W/QGIS Python with GDAL and NumPy.
"""
from __future__ import annotations
import csv, json, math, shutil, hashlib, sys, zipfile
from pathlib import Path
from datetime import datetime, timezone

try:
    import numpy as np
    from osgeo import gdal
except Exception as exc:
    print("ERROR: This must run in OSGeo4W Shell / QGIS Python with GDAL and NumPy.")
    print(exc)
    sys.exit(2)

gdal.UseExceptions()
DATA = Path(r"C:\KUNTAU_TERRAPULSE\data")
HOME = Path.home()
META = HOME / "Downloads" / "ktp_metadata_tool" / "KTP_NISAR_METADATA"
ASSETS = HOME / "Downloads" / "ktp_metadata_tool" / "KTP_NISAR_SMALL_ASSETS"
OUT = DATA / "KTP_DELIVERABLES"
BEFORE = DATA / "Kura_Before_2026-10-08.tif"
AFTER = DATA / "Kura_After_2026-10-20.tif"
SCENE_BEFORE = "NISAR_L2_PR_GCOV_032_123_D_083_2005_SHSH_A_20261008T175433_20261008T175508_P05023_N_F_J_001"
SCENE_AFTER = "NISAR_L2_PR_GCOV_033_123_D_083_2005_DHDH_A_20261020T175433_20261020T175508_P05023_N_F_J_001"


def write_rgba(path: Path, rgb: tuple[np.ndarray, np.ndarray, np.ndarray], alpha: np.ndarray):
    """Write a four-band RGBA PNG via MEM + PNG CreateCopy.

    GDAL's PNG driver is CreateCopy-only on many Windows builds; calling
    PNG.Create() raises "no create method implemented for this format".
    """
    h, w = alpha.shape
    mem_driver = gdal.GetDriverByName("MEM")
    png_driver = gdal.GetDriverByName("PNG")
    if mem_driver is None or png_driver is None:
        raise RuntimeError("GDAL MEM and PNG drivers must be available")
    mem = mem_driver.Create("", w, h, 4, gdal.GDT_Byte)
    if mem is None:
        raise RuntimeError("Could not allocate temporary RGBA image in GDAL MEM driver")
    color_interps = [gdal.GCI_RedBand, gdal.GCI_GreenBand, gdal.GCI_BlueBand, gdal.GCI_AlphaBand]
    for idx, arr in enumerate((*rgb, alpha), start=1):
        band = mem.GetRasterBand(idx)
        band.WriteArray(np.asarray(arr, dtype=np.uint8))
        band.SetColorInterpretation(color_interps[idx - 1])
    mem.FlushCache()
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        path.unlink()
    out = png_driver.CreateCopy(str(path), mem, strict=0)
    if out is None:
        mem = None
        raise RuntimeError(f"PNG CreateCopy failed: {path}")
    out.FlushCache()
    out = None
    mem = None


def create_rgba_geotiff(path: Path, rgb, alpha, reference):
    h, w = alpha.shape
    drv = gdal.GetDriverByName("GTiff")
    ds = drv.Create(str(path), w, h, 4, gdal.GDT_Byte, options=["COMPRESS=DEFLATE", "PREDICTOR=2"])
    ds.SetGeoTransform(reference.GetGeoTransform())
    ds.SetProjection(reference.GetProjection())
    for idx, arr in enumerate((*rgb, alpha), start=1):
        b = ds.GetRasterBand(idx)
        b.WriteArray(np.asarray(arr, dtype=np.uint8))
        b.SetColorInterpretation([gdal.GCI_RedBand, gdal.GCI_GreenBand, gdal.GCI_BlueBand, gdal.GCI_AlphaBand][idx-1])
    ds = None


def percentile_stretch(a, valid, lo, hi):
    clipped = np.clip((a - lo) / (hi - lo), 0, 1)
    return np.rint(clipped * 255).astype(np.uint8)


def inventory_file(path: Path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return {"file": path.name, "bytes": path.stat().st_size, "sha256": h.hexdigest()}


def main():
    print("KTP local NISAR processing — no network downloads")
    print("Input data:", DATA)
    if not BEFORE.is_file() or not AFTER.is_file():
        print("ERROR: Could not find both original GeoTIFFs in", DATA)
        print("Expected:", BEFORE.name, "and", AFTER.name)
        sys.exit(3)
    OUT.mkdir(parents=True, exist_ok=True)
    for sub in ("01_VISUALIZATIONS", "02_RASTERS", "03_METADATA", "04_QA", "05_DOCUMENTATION"):
        (OUT / sub).mkdir(exist_ok=True)

    bds, ads = gdal.Open(str(BEFORE)), gdal.Open(str(AFTER))
    if bds.RasterCount < 2 or ads.RasterCount < 2:
        raise RuntimeError("Expected Band 1 measurement + Band 2 alpha mask in both rasters")
    if (bds.RasterXSize, bds.RasterYSize) != (ads.RasterXSize, ads.RasterYSize):
        raise RuntimeError("Raster dimensions differ; stopping rather than silently aligning them")
    if bds.GetGeoTransform() != ads.GetGeoTransform() or bds.GetProjection() != ads.GetProjection():
        raise RuntimeError("Raster georeferencing differs; stopping rather than silently aligning them")

    before = bds.GetRasterBand(1).ReadAsArray().astype(np.float64)
    after = ads.GetRasterBand(1).ReadAsArray().astype(np.float64)
    mask_b = bds.GetRasterBand(2).ReadAsArray() > 0
    mask_a = ads.GetRasterBand(2).ReadAsArray() > 0
    valid = mask_b & mask_a & np.isfinite(before) & np.isfinite(after)
    n_valid = int(valid.sum())
    if n_valid < 100:
        raise RuntimeError(f"Too few common valid pixels: {n_valid}")

    bv, av = before[valid], after[valid]
    delta = after - before
    dv = delta[valid]
    # Shared display range: pooled 2nd–98th percentile, avoiding max outlier dominance.
    pooled = np.concatenate((bv, av))
    stretch_lo, stretch_hi = [float(x) for x in np.percentile(pooled, [2, 98])]
    if not stretch_hi > stretch_lo:
        raise RuntimeError("Could not calculate a valid shared display stretch")
    b8 = percentile_stretch(before, valid, stretch_lo, stretch_hi)
    a8 = percentile_stretch(after, valid, stretch_lo, stretch_hi)
    alpha = np.where(valid, 255, 0).astype(np.uint8)
    # Neutral grayscale previews keep the radar images honest; identical stretch allows visual comparison.
    b_rgb = (b8, b8, b8)
    a_rgb = (a8, a8, a8)

    # Difference preview: continuous diverging palette only. No flood/crop classes are assigned.
    dlim = float(np.percentile(np.abs(dv), 98))
    if dlim <= 0 or not math.isfinite(dlim):
        dlim = float(np.max(np.abs(dv))) or 1.0
    z = np.clip(delta / dlim, -1, 1)
    # Negative = blue, near-zero = very light neutral, positive = red.
    r = np.where(z >= 0, 245, 245 * (1 + z)).clip(0, 255)
    g = np.where(z >= 0, 245 * (1 - z), 245 * (1 + z)).clip(0, 255)
    bl = np.where(z >= 0, 245 * (1 - z), 245).clip(0, 255)
    d_rgb = (np.rint(r).astype(np.uint8), np.rint(g).astype(np.uint8), np.rint(bl).astype(np.uint8))
    for band in d_rgb:
        band[~valid] = 0

    vis = OUT / "01_VISUALIZATIONS"
    ras = OUT / "02_RASTERS"
    write_rgba(vis / "KTP_BEFORE_2026-10-08.png", b_rgb, alpha)
    write_rgba(vis / "KTP_AFTER_2026-10-20.png", a_rgb, alpha)
    write_rgba(vis / "KTP_CHANGE_EXPLORATORY.png", d_rgb, alpha)
    create_rgba_geotiff(ras / "KTP_BEFORE_DISPLAY_ONLY.tif", b_rgb, alpha, bds)
    create_rgba_geotiff(ras / "KTP_AFTER_DISPLAY_ONLY.tif", a_rgb, alpha, ads)
    create_rgba_geotiff(ras / "KTP_CHANGE_PREVIEW_EXPLORATORY.tif", d_rgb, alpha, bds)

    # Scientific floating-point difference raster, with NoData outside common valid mask.
    diff_path = ras / "KTP_CHANGE_EXPLORATORY_FLOAT32.tif"
    drv = gdal.GetDriverByName("GTiff")
    diff_ds = drv.Create(str(diff_path), bds.RasterXSize, bds.RasterYSize, 1, gdal.GDT_Float32,
                         options=["COMPRESS=DEFLATE", "PREDICTOR=3"])
    diff_ds.SetGeoTransform(bds.GetGeoTransform())
    diff_ds.SetProjection(bds.GetProjection())
    db = diff_ds.GetRasterBand(1)
    out_arr = np.where(valid, delta, -9999.0).astype(np.float32)
    db.WriteArray(out_arr)
    db.SetNoDataValue(-9999.0)
    db.SetDescription("After minus before HH measurement; exploratory; common alpha-valid pixels only")
    diff_ds = None

    # Summary statistics: sign counts are measurement directions, NOT environmental classes.
    summary = {
        "project": "KUNTAU TERRAPULSE (KTP)",
        "analysis_status": "EXPLORATORY — scientific comparability review required",
        "before_date": "2026-10-08", "after_date": "2026-10-20", "interval_days": 12,
        "before_product_id": SCENE_BEFORE, "after_product_id": SCENE_AFTER,
        "measurement": "Frequency A HHHH; band 1 from supplied GeoTIFFs",
        "before_mode": "SHSH", "after_mode": "DHDH",
        "crs": "EPSG:32632", "pixel_size_m": [20, 20],
        "width": int(bds.RasterXSize), "height": int(bds.RasterYSize),
        "total_pixels": int(valid.size), "before_alpha_valid": int(mask_b.sum()),
        "after_alpha_valid": int(mask_a.sum()), "common_valid_pixels": n_valid,
        "before": {"min": float(bv.min()), "p2": float(np.percentile(bv,2)), "median": float(np.median(bv)), "mean": float(bv.mean()), "p98": float(np.percentile(bv,98)), "max": float(bv.max())},
        "after": {"min": float(av.min()), "p2": float(np.percentile(av,2)), "median": float(np.median(av)), "mean": float(av.mean()), "p98": float(np.percentile(av,98)), "max": float(av.max())},
        "delta_after_minus_before": {"min": float(dv.min()), "p2": float(np.percentile(dv,2)), "median": float(np.median(dv)), "mean": float(dv.mean()), "p98": float(np.percentile(dv,98)), "max": float(dv.max()), "positive_pixels": int((dv>0).sum()), "negative_pixels": int((dv<0).sum()), "exact_zero_pixels": int((dv==0).sum())},
        "display_stretch_pooled_percentiles": {"p2": stretch_lo, "p98": stretch_hi},
        "change_preview_symmetric_abs_p98": dlim,
        "interpretation_warning": "Positive/negative values indicate changes in the measured HH radar return only. They do not by themselves identify flooding, crop damage, crop health, soil moisture or river depth.",
        "comparability_warning": "The 8 October product is SHSH single-polarization and the 20 October product is DHDH dual-polarization. The shared Frequency-A HHHH channel is used, but product QA and acquisition comparability must be reviewed before drawing environmental conclusions.",
        "generated_utc": datetime.now(timezone.utc).isoformat(),
    }
    (OUT / "03_METADATA" / "KTP_ANALYSIS_METADATA.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    with (OUT / "03_METADATA" / "KTP_ANALYSIS_SUMMARY.csv").open("w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["metric", "value"])
        for k,v in summary.items():
            if isinstance(v, dict):
                for sk,sv in v.items(): w.writerow([f"{k}.{sk}", sv])
            else: w.writerow([k,v])

    # Copy the already-created ASF catalog metadata and selected small assets if present.
    copied = []
    for src_dir, dest_dir in ((META, OUT/"03_METADATA"), (ASSETS/"2026-10-08", OUT/"04_QA"/"2026-10-08"), (ASSETS/"2026-10-20", OUT/"04_QA"/"2026-10-20")):
        if src_dir.exists():
            for p in src_dir.iterdir():
                if p.is_file() and p.suffix.lower() in (".json", ".csv", ".geojson", ".xml", ".pdf", ".png"):
                    dest_dir.mkdir(parents=True, exist_ok=True)
                    dest = dest_dir / p.name
                    if not dest.exists(): shutil.copy2(p, dest)
                    copied.append(str(dest.relative_to(OUT)))

    # Preserve the raster audit text/JSON reports as part of project provenance.
    audit = DATA / "audit"
    if audit.exists():
        dest = OUT / "03_METADATA" / "GDAL_AUDIT"
        dest.mkdir(exist_ok=True)
        for p in audit.glob("*"):
            if p.is_file() and p.suffix.lower() in (".txt", ".json"):
                shutil.copy2(p, dest / p.name)
                copied.append(str((dest/p.name).relative_to(OUT)))

    readme = f"""KUNTAU TERRAPULSE — LOCAL NISAR OUTPUTS\n\nSTATUS: EXPLORATORY. Do not describe this as a validated flood map, crop-health map, flood prediction or river-depth product.\n\nINPUT OBSERVATIONS\n8 Oct 2026: {SCENE_BEFORE} (SHSH)\n20 Oct 2026: {SCENE_AFTER} (DHDH)\nCommon measurement extracted: Frequency-A HHHH, Band 1 from the supplied GeoTIFFs.\n\nGRID CHECK\n{bds.RasterXSize} x {bds.RasterYSize} pixels; EPSG:32632; 20 m pixels; identical geotransform and projection.\nCommon alpha-valid pixels: {n_valid} of {valid.size}.\n\nVISUALIZATIONS\nBefore/after previews use the same pooled 2nd–98th percentile display stretch. Display copies are for visual presentation only.\nChange preview uses blue for negative (after lower than before), pale neutral near zero, red for positive (after higher than before). This is a continuous measurement-difference display, not a cause classification.\n\nSCIENTIFIC CAUTION\nThe source acquisition modes differ (SHSH vs DHDH). Although the shared Frequency-A HHHH channel was extracted, QA reports and product-level comparability must be reviewed before environmental interpretation. Radar returns can respond to multiple surface and geometry factors. Ground observations and independent evidence are required.\n\nOUTPUTS\n01_VISUALIZATIONS: PNG previews\n02_RASTERS: georeferenced RGB display GeoTIFFs and Float32 exploratory difference GeoTIFF\n03_METADATA: analysis JSON/CSV, ASF catalogue records (when present), GDAL audit reports\n04_QA: downloaded QA PDFs/CSVs/XML/quicklook PNGs (when present)\n\nProcessing was run locally. This script makes no network requests and downloads no files.\n"""
    (OUT / "05_DOCUMENTATION" / "KTP_PROCESSING_README.txt").write_text(readme, encoding="utf-8")
    (OUT / "05_DOCUMENTATION" / "FARMER_EXPLANATION.txt").write_text(
        "WHAT THIS MAP SHOWS\n\nThis is a satellite radar measurement, not an ordinary camera photograph.\n\nBEFORE: what the satellite measured on 8 October 2026.\nAFTER: what it measured on 20 October 2026.\nCHANGE: places where the measured radar return is higher or lower in the later observation.\n\nA change does not automatically mean flooding, crop damage or better crop growth. Water, vegetation, soil surface, moisture and viewing conditions can all affect radar measurements.\n\nWHAT TO DO: use highlighted locations as places to investigate. Check with farmers, field observations, rainfall records and local river information before making a decision.\n",
        encoding="utf-8")

    # File inventory of the deliverables.
    inv_path = OUT / "05_DOCUMENTATION" / "KTP_FILE_INVENTORY.csv"
    with inv_path.open("w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=["file", "bytes", "sha256"])
        w.writeheader()
        for p in sorted(OUT.rglob("*")):
            if p.is_file() and p != inv_path:
                w.writerow(inventory_file(p))
    bundle = DATA / "KTP_DELIVERABLES_BUNDLE.zip"
    with zipfile.ZipFile(bundle, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for p in sorted(OUT.rglob("*")):
            if p.is_file():
                zf.write(p, p.relative_to(OUT.parent))
    print("\nSUCCESS — local outputs created:", OUT)
    print("Deliverables ZIP:", bundle)
    print("Common valid pixels:", n_valid)
    print("Before mean:", f"{bv.mean():.6f}", "After mean:", f"{av.mean():.6f}", "Mean delta:", f"{dv.mean():.6f}")
    print("NoData/masked pixels excluded from difference.")
    print("No HDF5 files downloaded. No network access used.")
    print("IMPORTANT: difference is exploratory; SHSH vs DHDH QA comparability review remains open.")
    print("Open the output folder:", OUT)

if __name__ == "__main__":
    main()
