#!/usr/bin/env python3
"""Download and validate Census 2026 TIGER/Line state boundaries as GeoJSON."""
from __future__ import annotations

import argparse
import hashlib
import json
import tempfile
import urllib.request
import zipfile
from datetime import datetime, timezone
from pathlib import Path

SOURCE_URL = "https://www2.census.gov/geo/tiger/TIGER2026/STATE/tl_2026_us_state.zip"
EXPECTED_STATES = set(
    "AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC".split()
)


def positions(value):
    """Yield coordinate pairs recursively from a GeoJSON coordinate array."""
    if isinstance(value, (list, tuple)) and len(value) >= 2:
        if isinstance(value[0], (int, float)) and isinstance(value[1], (int, float)):
            yield float(value[0]), float(value[1])
            return
        for child in value:
            yield from positions(child)


def convert_shapefile(shp_path: Path) -> list[dict]:
    try:
        import shapefile
    except ImportError as exc:
        raise RuntimeError("Install the pinned pyshp dependency before conversion.") from exc

    prj_path = shp_path.with_suffix(".prj")
    if not prj_path.exists():
        raise RuntimeError("TIGER state shapefile is missing its .prj projection file.")
    prj = prj_path.read_text(encoding="utf-8", errors="replace").upper()
    if "GEOGCS" not in prj or not ("NORTH_AMERICAN_1983" in prj or "NAD_1983" in prj):
        raise RuntimeError("Expected geographic NAD83 coordinates; refusing to emit unverified coordinates.")

    reader = shapefile.Reader(str(shp_path), encoding="utf-8")
    field_names = [field[0] for field in reader.fields[1:]]
    required = {"STUSPS", "NAME", "STATEFP"}
    if not required.issubset(set(field_names)):
        raise RuntimeError(f"Missing expected TIGER fields: {sorted(required - set(field_names))}")

    features = []
    seen = set()
    for shape_record in reader.iterShapeRecords():
        attributes = dict(zip(field_names, list(shape_record.record)))
        postal = str(attributes.get("STUSPS", "")).strip().upper()
        if postal not in EXPECTED_STATES:
            continue
        if postal in seen:
            raise RuntimeError(f"Duplicate state feature for {postal}.")
        geometry = shape_record.shape.__geo_interface__
        if geometry.get("type") not in ("Polygon", "MultiPolygon"):
            raise RuntimeError(f"Unexpected geometry type for {postal}: {geometry.get('type')}")
        coords = geometry.get("coordinates")
        if not coords:
            raise RuntimeError(f"Empty polygon geometry for {postal}.")
        for lon, lat in positions(coords):
            if not (-180 <= lon <= 180 and -90 <= lat <= 90):
                raise RuntimeError(f"Coordinate outside lon/lat bounds for {postal}: {lon}, {lat}")
        seen.add(postal)
        features.append({
            "type": "Feature",
            "properties": {
                "STUSPS": postal,
                "NAME": str(attributes["NAME"]),
                "STATEFP": str(attributes["STATEFP"]).zfill(2),
            },
            "geometry": geometry,
        })

    missing = sorted(EXPECTED_STATES - seen)
    extra = sorted(seen - EXPECTED_STATES)
    if missing or extra or len(features) != 51:
        raise RuntimeError(
            f"Expected exactly 50 states + DC; got {len(features)} features. "
            f"Missing={missing}; unexpected={extra}"
        )
    return sorted(features, key=lambda item: item["properties"]["STUSPS"])


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default=SOURCE_URL, help="Official Census TIGER/Line state ZIP URL")
    parser.add_argument("--output", default="data/geo/tiger-2026-us-states.geojson")
    args = parser.parse_args()

    request = urllib.request.Request(
        args.url,
        headers={"User-Agent": "RelocationCost-B24-research/1.0"},
    )
    with urllib.request.urlopen(request, timeout=180) as response:
        archive_bytes = response.read()
    digest = hashlib.sha256(archive_bytes).hexdigest()

    with tempfile.TemporaryDirectory(prefix="b24-tiger-") as temp_dir:
        root = Path(temp_dir)
        archive_path = root / "tiger.zip"
        archive_path.write_bytes(archive_bytes)
        with zipfile.ZipFile(archive_path) as archive:
            for info in archive.infolist():
                target = (root / info.filename).resolve()
                if root.resolve() not in target.parents and target != root.resolve():
                    raise RuntimeError("Unsafe path in Census ZIP archive.")
            archive.extractall(root)
        shapefiles = list(root.rglob("tl_2026_us_state.shp"))
        if len(shapefiles) != 1:
            raise RuntimeError(f"Expected one tl_2026_us_state.shp; found {len(shapefiles)}.")
        features = convert_shapefile(shapefiles[0])

    collection = {
        "type": "FeatureCollection",
        "name": "Census 2026 TIGER/Line U.S. state boundaries",
        "source": "U.S. Census Bureau, TIGER/Line 2026",
        "source_url": args.url,
        "vintage": 2026,
        "boundary_as_of": "2026-01-01",
        "downloaded_at_utc": datetime.now(timezone.utc).isoformat(),
        "source_zip_sha256": digest,
        "feature_count": len(features),
        "attribution": "Source: U.S. Census Bureau, TIGER/Line 2026. Acknowledgement required.",
        "use_limitations": (
            "TIGER/Line boundaries are for statistical data collection and tabulation; "
            "they are not legal land descriptions or determinations of jurisdiction."
        ),
        "coordinate_reference_system": "NAD83 geographic longitude/latitude",
        "features": features,
    }
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(collection, separators=(",", ":")) + "\n", encoding="utf-8")
    print(json.dumps({
        "output": str(output),
        "feature_count": len(features),
        "source_zip_bytes": len(archive_bytes),
        "source_zip_sha256": digest,
        "vintage": 2026,
        "boundary_as_of": "2026-01-01",
    }, indent=2))


if __name__ == "__main__":
    main()
