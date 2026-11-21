#!/usr/bin/env python3
"""Run the research-only B24 PADD fuel allocator over all 44 city routes.

This produces an auditable report. A route rejected by the strict geometry /
stored-distance or coverage gates is reported as blocked, never silently priced.
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from tools.b24_padd_allocation import AllocationError, allocate_route, price_fuel


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--routes-dir", type=Path, default=ROOT / "data/route-geometries/city")
    parser.add_argument("--states", type=Path, default=ROOT / "data/geo/tiger-2026-us-states.geojson")
    parser.add_argument("--prices", type=Path, default=ROOT / "data/research/eia-diesel-padd-prices-2026-11-16.json")
    parser.add_argument("--manifest", type=Path, default=ROOT / "data/route-geometries/manifest.json")
    parser.add_argument("--route-index", type=Path, default=ROOT / "data/city-routes.json")
    parser.add_argument("--gallons-per-mile", type=float, default=0.122605)
    parser.add_argument("--output", type=Path, default=ROOT / "artifacts/b24-padd-city-validation.json")
    args = parser.parse_args()

    manifest = read_json(args.manifest)
    prices = read_json(args.prices)
    states = read_json(args.states)
    route_index = read_json(args.route_index)
    expected_slugs = sorted(route["slug"] for route in route_index["routes"])
    route_files = sorted(args.routes_dir.glob("*.geojson"))
    actual_slugs = sorted(path.stem for path in route_files)

    report = {
        "schema_version": "1.0",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "scope": "44 city routes; research-only; fuel-only; not production calibration",
        "inputs": {
            "provider": manifest.get("provider"),
            "manifest_generated_at": manifest.get("generated_at"),
            "eia_reference_week": prices.get("reference_week", prices.get("week_of")),
            "gallons_per_mile": args.gallons_per_mile,
            "route_geometry_files": len(route_files),
            "manifest_requested": manifest.get("requested"),
            "manifest_fetched": manifest.get("fetched"),
            "manifest_failures": manifest.get("failures", []),
            "distance_mismatches_over_1pct": manifest.get("distance_mismatches_over_1pct", []),
        },
        "summary": {},
        "routes": [],
        "integrity_errors": [],
    }

    if expected_slugs != actual_slugs:
        missing = sorted(set(expected_slugs) - set(actual_slugs))
        unexpected = sorted(set(actual_slugs) - set(expected_slugs))
        report["integrity_errors"].append({"missing_routes": missing, "unexpected_routes": unexpected})
    if manifest.get("requested") != len(expected_slugs) or manifest.get("fetched") != len(expected_slugs):
        report["integrity_errors"].append({
            "manifest_count_mismatch": {
                "expected": len(expected_slugs),
                "requested": manifest.get("requested"),
                "fetched": manifest.get("fetched"),
            }
        })
    if manifest.get("failures"):
        report["integrity_errors"].append({"manifest_failures": manifest["failures"]})

    for path in route_files:
        route_id = path.stem
        row = {"route_id": route_id, "status": "blocked"}
        try:
            route = read_json(path)
            allocation = allocate_route(route, states)
            fuel = price_fuel(allocation, prices, args.gallons_per_mile)
            row.update({
                "status": "validated",
                "route_miles": allocation["route_miles"],
                "coverage_pct_exact": allocation["coverage_pct_exact"],
                "unmatched_miles": allocation["unmatched_miles"],
                "miles_by_state": allocation["miles_by_state"],
                "miles_by_padd": allocation["miles_by_padd"],
                "fuel": fuel,
            })
        except (AllocationError, KeyError, TypeError, ValueError, OSError, json.JSONDecodeError) as exc:
            row["reason"] = str(exc)
        report["routes"].append(row)

    validated = sum(row["status"] == "validated" for row in report["routes"])
    blocked = len(report["routes"]) - validated
    report["summary"] = {
        "expected_routes": len(expected_slugs),
        "files_found": len(route_files),
        "processed_routes": len(report["routes"]),
        "validated_routes": validated,
        "blocked_routes": blocked,
        "integrity_errors": len(report["integrity_errors"]),
        "acceptance_status": "PASS" if validated == len(expected_slugs) and not report["integrity_errors"] else "BLOCKED",
        "note": "A report can complete while acceptance remains BLOCKED. Blocked routes are not priced or silently normalized.",
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report["summary"], indent=2))
    for row in report["routes"]:
        if row["status"] != "validated":
            print(f"BLOCKED {row['route_id']}: {row.get('reason', 'unknown error')}")
    return 0 if len(report["routes"]) == len(expected_slugs) else 1


if __name__ == "__main__":
    raise SystemExit(main())
