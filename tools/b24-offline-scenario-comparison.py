#!/usr/bin/env python3
"""Offline B24 research prototype: VIUS fuel + EIA route PADD + BLS wages + crew-hour scenarios.

This is a partial cost diagnostic, NOT a quote or complete full-service cost model.
It does not import or modify production calculator code or coefficients.
"""
from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from tools.b24_padd_allocation import AllocationError, allocate_route, price_fuel

# Audited from the 2021 VIUS PUF extraction documented in
# docs/operations/B24-VIUS-WEIGHTED-EXTRACTION-2026-11-18.md.
# Cohort: BTYPE=07, BUSRELATED=1, diesel, GVWR classes 6-7.
VIUS_GALLONS_PER_MILE = 0.122605
VIUS_CLASS6_WEIGHTED_VEHICLES = 239835
VIUS_CLASS7_WEIGHTED_VEHICLES = 77450
VIUS_SOURCE = "2021 VIUS PUF; TABWEIGHT-weighted mean of per-record 1/MPG; 1,080 valid records; RGROUP CV 1.6%"
CLASS6_SHARE = VIUS_CLASS6_WEIGHTED_VEHICLES / (VIUS_CLASS6_WEIGHTED_VEHICLES + VIUS_CLASS7_WEIGHTED_VEHICLES)
CLASS7_SHARE = 1.0 - CLASS6_SHARE
SIZE_KEYS = ("1", "1.35", "1.8", "2.4")


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def load_wages(path: Path):
    wages = {}
    with path.open(encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            if row.get("AREA_TYPE") != "2" or row.get("PRIM_STATE") not in {
                "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
            }:
                continue
            try:
                wages[(row["PRIM_STATE"], row["OCC_CODE"])] = float(row["H_MEDIAN"])
            except (KeyError, ValueError):
                continue
    return wages


def cmr_band_for(miles, cmr):
    for band in cmr["distance_bands"]:
        if miles >= band["min_miles"] and (band["max_miles"] is None or miles <= band["max_miles"]):
            return band
    return None


def build_report(args):
    prices = load_json(args.prices)
    states = load_json(args.states)
    cities = load_json(args.cities)["cities"]
    route_index = load_json(args.route_index)["routes"]
    cmr = load_json(args.cmr)
    scenarios = load_json(args.scenarios)
    wages = load_wages(args.bls_state_csv)

    rows = []
    for route in route_index:
        slug = route["slug"]
        path = args.routes_dir / f"{slug}.geojson"
        item = {"route_id": slug, "status": "blocked"}
        try:
            feature = load_json(path)
            props = feature.get("properties", {})
            origin = cities[route["from"]]
            destination = cities[route["to"]]
            allocation = allocate_route(feature, states)
            fuel = price_fuel(allocation, prices, VIUS_GALLONS_PER_MILE)
            duration = props.get("provider_duration_seconds")
            if not isinstance(duration, (int, float)) or duration <= 0:
                raise AllocationError("Missing positive provider_duration_seconds; no synthetic road-time estimate.")
            miles = float(allocation["route_miles"])
            band = cmr_band_for(miles, cmr)
            if band is None:
                raise AllocationError(f"Route distance {miles:.1f} mi is outside CMR comparison bands.")

            # VIUS GVWR weights blend the two BLS driver occupation wage proxies.
            # The dispatch/origin state is an explicit proxy, not a measured carrier home-base.
            state = origin["state"]
            light = wages.get((state, "53-3033"))
            heavy = wages.get((state, "53-3032"))
            handling_origin = wages.get((state, "53-7062"))
            handling_destination = wages.get((destination["state"], "53-7062"))
            if None in (light, heavy, handling_origin, handling_destination):
                raise AllocationError(f"Missing BLS median hourly wage for route state(s): {state}, {destination['state']}.")
            driver_wage = CLASS6_SHARE * light + CLASS7_SHARE * heavy
            driver_hours = duration / 3600.0
            driver_labor = driver_hours * driver_wage
            item.update({
                "status": "ready",
                "origin": origin["name"] + ", " + state,
                "destination": destination["name"] + ", " + destination["state"],
                "route_miles": round(miles, 1),
                "route_duration_hours_provider": round(driver_hours, 2),
                "route_duration_note": "HeiGIT/ORS routing duration; not HOS schedule, full paid duty time, or guaranteed ETA.",
                "eia_reference_week": prices.get("reference_week", prices.get("week_of")),
                "padd_miles": allocation["miles_by_padd"],
                "fuel_only_usd": fuel["fuel_only_cost_usd"],
                "driver_wage_proxy_usd_per_hour": round(driver_wage, 2),
                "driver_wage_proxy_basis": f"Origin-state OEWS H_MEDIAN; class 6 SOC 53-3033 weight {CLASS6_SHARE:.3f}, class 7 SOC 53-3032 weight {CLASS7_SHARE:.3f}; no employer burden.",
                "driver_road_time_labor_usd": round(driver_labor, 2),
                "cmr_distance_band": band["label"],
                "cmr_comparison": {},
            })
            for size in SIZE_KEYS:
                cell = band["sizes"][size]
                item["cmr_comparison"][size] = {
                    "cmr_low_usd": cell["low"], "cmr_median_usd": cell["median"],
                    "cmr_high_usd": cell["high"], "cmr_bookings_n": cell["n"]
                }
                item["cmr_comparison"][size]["scenarios"] = {}
                for scenario_key, scenario in scenarios["scenarios"].items():
                    crew_hours = float(scenario["crew_man_hours_by_size"][size])
                    # Total crew man-hours are split equally between the origin and destination labour markets.
                    handling_cost = crew_hours * 0.5 * handling_origin + crew_hours * 0.5 * handling_destination
                    subtotal = fuel["fuel_only_cost_usd"] + driver_labor + handling_cost
                    item["cmr_comparison"][size]["scenarios"][scenario_key] = {
                        "scenario_label": scenario["label"],
                        "crew_man_hours_assumption_not_evidence": crew_hours,
                        "origin_destination_handling_wage_cost_usd": round(handling_cost, 2),
                        "partial_cost_subtotal_usd": round(subtotal, 2),
                        "vs_cmr": "below_cmr_low" if subtotal < cell["low"] else "inside_cmr_band" if subtotal <= cell["high"] else "above_cmr_high",
                        "gap_to_cmr_median_usd": round(subtotal - cell["median"], 2)
                    }
        except (OSError, ValueError, KeyError, TypeError, AllocationError, json.JSONDecodeError) as exc:
            item["reason"] = str(exc)
        rows.append(item)

    ready = [r for r in rows if r["status"] == "ready"]
    report = {
        "schema_version": "1.0",
        "generated_at": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
        "status": "offline_research_only_partial_cost_scenario_comparison",
        "production_changes": False,
        "scope": "44 existing city routes; only routes passing geometry/PADD coverage and stored-distance gates are compared.",
        "inputs": {
            "vius_gallons_per_mile": VIUS_GALLONS_PER_MILE,
            "vius_source": VIUS_SOURCE,
            "vius_class6_weighted_vehicles": VIUS_CLASS6_WEIGHTED_VEHICLES,
            "vius_class7_weighted_vehicles": VIUS_CLASS7_WEIGHTED_VEHICLES,
            "eia_reference_week": prices.get("reference_week", prices.get("week_of")),
            "bls_reference_period": "May 2025 OEWS; state H_MEDIAN hourly wages",
            "cmr_source": cmr["source"],
            "crew_scenarios": scenarios
        },
        "summary": {
            "routes_expected": len(route_index), "routes_ready": len(ready),
            "routes_blocked": len(rows) - len(ready),
            "blocked_route_ids": [r["route_id"] for r in rows if r["status"] != "ready"]
        },
        "interpretation": [
            "The subtotal contains fuel, driver route-time wages, and scenario handling wages only.",
            "It excludes maintenance, tires, insurance, depreciation/capital, tolls, dispatch, overhead, profit, packing, taxes/benefits/payroll burden, non-driving driver duty, return/deadhead and other service scope.",
            "It is not an apples-to-apples full-service quote and must not be interpreted as a consumer price or calibrated rate.",
            "Crew man-hours are analyst-selected low/base/high sensitivity assumptions, not observed evidence or VIUS/BLS estimates.",
            "CMR is one mover network's booked estimate distribution, not a national market distribution."
        ],
        "routes": rows
    }
    return report


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--routes-dir", type=Path, default=ROOT / "data/route-geometries/city")
    p.add_argument("--states", type=Path, default=ROOT / "data/geo/tiger-2026-us-states.geojson")
    p.add_argument("--prices", type=Path, default=ROOT / "data/research/eia-diesel-padd-prices-2026-11-16.json")
    p.add_argument("--cities", type=Path, default=ROOT / "data/cities.json")
    p.add_argument("--route-index", type=Path, default=ROOT / "data/city-routes.json")
    p.add_argument("--bls-state-csv", type=Path, default=ROOT / "data/research/bls-oews-2025/state-soc-53-3032-3033-7062.csv")
    p.add_argument("--cmr", type=Path, default=ROOT / "data/cmr-full-service-ranges.json")
    p.add_argument("--scenarios", type=Path, default=ROOT / "data/research/b24-crew-hours-scenarios-2026-11-26.json")
    p.add_argument("--output", type=Path, default=ROOT / "artifacts/b24-offline-scenario-comparison-2026-11-26.json")
    args = p.parse_args()
    report = build_report(args)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report["summary"], indent=2))
    for row in report["routes"]:
        if row["status"] != "ready":
            print(f"BLOCKED {row['route_id']}: {row.get('reason', 'unknown')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
