"""Retrieve ASF catalog metadata for the two KTP NISAR GCOV products.

Default: writes small catalog metadata files only (no HDF5 download).
Optional: pass --download to download the original HDF5 science products.
Earthdata credentials are requested interactively and are never saved here.
"""
from __future__ import annotations

import argparse
import getpass
import json
import sys
from pathlib import Path

PRODUCTS = [
    "NISAR_L2_PR_GCOV_032_123_D_083_2005_SHSH_A_20261008T175433_20261008T175508_P05023_N_F_J_001",
    "NISAR_L2_PR_GCOV_033_123_D_083_2005_DHDH_A_20261020T175433_20261020T175508_P05023_N_F_J_001",
]


def main() -> int:
    parser = argparse.ArgumentParser(description="Retrieve KTP NISAR GCOV catalog metadata")
    parser.add_argument("--download", action="store_true", help="also download the original HDF5 science products")
    parser.add_argument("--out", default="KTP_NISAR_METADATA", help="output folder")
    args = parser.parse_args()

    try:
        import asf_search as asf
    except ImportError:
        print("Missing package: asf_search")
        print("Install it in this same OSGeo4W Shell with:")
        print("  python -m pip install --user asf_search")
        return 2

    out_dir = Path(args.out).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    print("Searching ASF for the two exact NISAR products...")
    results = asf.granule_search(PRODUCTS)
    found = len(results)
    print(f"Products found: {found} of {len(PRODUCTS)}")
    if found == 0:
        print("No matching products were returned. Check internet access and product availability.")
        return 3

    # Save catalog metadata before any optional large data download.
    geojson_text = results.geojson()
    if not isinstance(geojson_text, str):
        geojson_text = json.dumps(geojson_text, indent=2)
    (out_dir / "KTP_NISAR_GRANULES.geojson").write_text(geojson_text, encoding="utf-8")

    csv_text = results.csv()
    if not isinstance(csv_text, str):
        csv_text = str(csv_text)
    (out_dir / "KTP_NISAR_GRANULES.csv").write_text(csv_text, encoding="utf-8")

    details = []
    total_bytes = 0
    for i, item in enumerate(results, start=1):
        props = getattr(item, "properties", {}) or {}
        urls = []
        try:
            urls = item.get_urls() or []
        except Exception:
            pass
        record = {"requested_product_id": PRODUCTS[i - 1] if i <= len(PRODUCTS) else None,
                  "properties": props,
                  "download_urls": urls}
        details.append(record)
        print(f"\nProduct {i}:")
        for key in ("fileName", "sceneName", "granuleName", "bytes", "fileSize", "url", "startTime", "stopTime", "flightDirection", "polarization"):
            if key in props:
                print(f"  {key}: {props[key]}")
        if "bytes" in props:
            try:
                total_bytes += int(props["bytes"])
            except (TypeError, ValueError):
                pass
        for url in urls:
            print(f"  URL: {url}")

    (out_dir / "KTP_NISAR_GRANULE_DETAILS.json").write_text(
        json.dumps(details, indent=2, default=str), encoding="utf-8"
    )
    print(f"\nMetadata saved in: {out_dir}")
    print("Files: KTP_NISAR_GRANULES.geojson, KTP_NISAR_GRANULES.csv, KTP_NISAR_GRANULE_DETAILS.json")

    if not args.download:
        print("\nMetadata-only mode: no HDF5 science data was downloaded.")
        print("To download the full HDF5 products as well, rerun with --download after reviewing the sizes/URLs.")
        return 0

    print("\nYou requested the original HDF5 downloads.")
    if total_bytes:
        print(f"ASF catalog-reported total: {total_bytes / (1024**3):.2f} GiB")
    print("These are large science files; make sure you have enough data and disk space.")
    confirm = input("Type DOWNLOAD to continue: ").strip()
    if confirm != "DOWNLOAD":
        print("Download cancelled. Catalog metadata is already saved.")
        return 0

    username = input("Earthdata Login username: ").strip()
    password = getpass.getpass("Earthdata Login password (hidden): ")
    if not username or not password:
        print("Username/password missing; no download was started.")
        return 4

    try:
        session = asf.ASFSession().auth_with_creds(username, password)
        print("Starting HDF5 download. Keep this window open until it finishes.")
        results.download(path=str(out_dir / "HDF5_ORIGINALS"), session=session, processes=1)
        print("Download call completed. Check HDF5_ORIGINALS for the downloaded products.")
    except Exception as exc:
        print(f"Download failed: {type(exc).__name__}: {exc}")
        print("Your catalog metadata files remain saved. Do not share your password in chat.")
        return 5
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
