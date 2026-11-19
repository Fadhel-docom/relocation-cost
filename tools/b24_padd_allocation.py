#!/usr/bin/env python3
"""Allocate a road-route GeoJSON line across EIA PADDs and estimate fuel-only cost.

Inputs:
  route GeoJSON Feature/FeatureCollection/geometry. If the route has
  properties.expected_distance_miles, sampled geometry mileage is scaled to it
  only when the difference is <= 1%.
  Census/TIGER state-boundary GeoJSON FeatureCollection. Each feature must have
  a USPS postal abbreviation in STUSPS, USPS, postal, or state_abbr.
  Diesel prices JSON: {"week_of":"YYYY-MM-DD","usd_per_gallon":{"1":...,"2":...}}

This is deliberately not a complete truck-cost model. It returns fuel-only
route cost using the supplied gallons-per-mile factor and weekly PADD prices. It never assigns
uncovered route mileage to an endpoint PADD.
"""
from __future__ import annotations

import argparse
import json
import math
from collections import defaultdict
from pathlib import Path
from typing import Any

PADD_BY_STATE = {
    # EIA publishes PADD 1 subdistrict prices; use them when supplied.
    **{s: "1A" for s in "CT ME MA NH RI VT".split()},
    **{s: "1B" for s in "DE DC MD NJ NY PA".split()},
    **{s: "1C" for s in "FL GA NC SC VA WV".split()},
    # PADD 2 — Midwest
    **{s: "2" for s in "IL IN IA KS MI MN MO NE ND OH OK SD TN WI KY".split()},
    # PADD 3 — Gulf Coast
    **{s: "3" for s in "AL AR LA MS NM TX".split()},
    # PADD 4 — Rocky Mountain
    **{s: "4" for s in "CO ID MT UT WY".split()},
    # PADD 5 uses EIA's California and West Coast-less-California series.
    "CA": "5CA",
    **{s: "5X" for s in "AK AZ HI NV OR WA".split()},
}

EARTH_RADIUS_MILES = 3958.7613
MIN_ROUTE_COVERAGE_PCT = 99.999


class AllocationError(ValueError):
    """Raised when route geometry cannot be allocated with sufficient coverage."""


def haversine_miles(a: list[float] | tuple[float, float],
                    b: list[float] | tuple[float, float]) -> float:
    lon1, lat1 = map(math.radians, a[:2])
    lon2, lat2 = map(math.radians, b[:2])
    dlon, dlat = lon2 - lon1, lat2 - lat1
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return EARTH_RADIUS_MILES * 2 * math.asin(min(1.0, math.sqrt(h)))


def point_in_ring(point: tuple[float, float], ring: list[list[float]]) -> bool:
    """Ray-casting point-in-ring test; coordinates are (longitude, latitude)."""
    x, y = point
    inside = False
    for i, first in enumerate(ring):
        second = ring[(i + 1) % len(ring)]
        x1, y1 = first[:2]
        x2, y2 = second[:2]
        if (y1 > y) != (y2 > y):
            crossing_x = (x2 - x1) * (y - y1) / (y2 - y1) + x1
            if x < crossing_x:
                inside = not inside
    return inside


def point_in_polygon(point: tuple[float, float], polygon: list[list[list[float]]]) -> bool:
    if not polygon or not point_in_ring(point, polygon[0]):
        return False
    return not any(point_in_ring(point, hole) for hole in polygon[1:])


def feature_bounds(feature: dict[str, Any]) -> tuple[float, float, float, float] | None:
    """Return (min_lon, min_lat, max_lon, max_lat) for Polygon/MultiPolygon."""
    geometry = feature.get("geometry") or {}
    kind, coordinates = geometry.get("type"), geometry.get("coordinates", [])
    polygons = [coordinates] if kind == "Polygon" else coordinates if kind == "MultiPolygon" else []
    points = [point for polygon in polygons for ring in polygon for point in ring if len(point) >= 2]
    if not points:
        return None
    return (
        min(point[0] for point in points),
        min(point[1] for point in points),
        max(point[0] for point in points),
        max(point[1] for point in points),
    )


def feature_contains(feature: dict[str, Any], point: tuple[float, float]) -> bool:
    geometry = feature.get("geometry") or {}
    kind, coordinates = geometry.get("type"), geometry.get("coordinates", [])
    if kind == "Polygon":
        return point_in_polygon(point, coordinates)
    if kind == "MultiPolygon":
        return any(point_in_polygon(point, polygon) for polygon in coordinates)
    return False


def state_abbreviation(feature: dict[str, Any]) -> str | None:
    props = feature.get("properties") or {}
    for key in ("STUSPS", "USPS", "postal", "state_abbr"):
        value = props.get(key)
        if isinstance(value, str) and len(value.strip()) == 2:
            return value.strip().upper()
    return None


def route_lines(value: dict[str, Any]) -> list[list[list[float]]]:
    """Accept GeoJSON Geometry, Feature, or FeatureCollection."""
    if value.get("type") == "FeatureCollection":
        lines = []
        for feature in value.get("features", []):
            lines.extend(route_lines(feature))
        return lines
    if value.get("type") == "Feature":
        return route_lines(value.get("geometry") or {})
    kind, coords = value.get("type"), value.get("coordinates", [])
    if kind == "LineString":
        return [coords] if len(coords) >= 2 else []
    if kind == "MultiLineString":
        return [line for line in coords if len(line) >= 2]
    raise AllocationError("Route input must contain a GeoJSON LineString or MultiLineString.")


def allocate_route(route: dict[str, Any],
                   states_geojson: dict[str, Any],
                   step_miles: float = 0.25) -> dict[str, Any]:
    if step_miles <= 0 or step_miles > 2:
        raise AllocationError("step_miles must be greater than 0 and no more than 2 miles.")
    features = []
    for feature in states_geojson.get("features", []):
        state = state_abbreviation(feature)
        bounds = feature_bounds(feature)
        if state in PADD_BY_STATE and bounds is not None:
            features.append((state, feature, bounds))
    if not features:
        raise AllocationError("No usable U.S. state polygons found; expected STUSPS/USPS postal codes.")

    properties = route.get("properties", {}) if route.get("type") == "Feature" else {}
    expected = properties.get("expected_distance_miles")
    if properties.get("stored_distance_match") is False:
        difference = properties.get("stored_distance_difference_pct")
        raise AllocationError(
            f"Stored road-distance matrix differs from the newly fetched ORS route "
            f"by {difference}%; inspect/reconcile before PADD allocation."
        )
    state_miles: dict[str, float] = defaultdict(float)
    unmatched_miles = 0.0
    geometry_miles = 0.0

    for line in route_lines(route):
        for a, b in zip(line, line[1:]):
            segment_miles = haversine_miles(a, b)
            if segment_miles == 0:
                continue
            pieces = max(1, math.ceil(segment_miles / step_miles))
            piece_miles = segment_miles / pieces
            for index in range(pieces):
                fraction = (index + 0.5) / pieces
                point = (
                    a[0] + (b[0] - a[0]) * fraction,
                    a[1] + (b[1] - a[1]) * fraction,
                )
                hits = sorted(
                    state
                    for state, feature, bounds in features
                    if bounds[0] <= point[0] <= bounds[2]
                    and bounds[1] <= point[1] <= bounds[3]
                    and feature_contains(feature, point)
                )
                geometry_miles += piece_miles
                if not hits:
                    unmatched_miles += piece_miles
                else:
                    # A sample exactly on a shared boundary is assigned
                    # deterministically to the alphabetically first USPS code.
                    state_miles[hits[0]] += piece_miles

    if geometry_miles <= 0:
        raise AllocationError("Route geometry has no measurable length.")
    uncovered_share = unmatched_miles / geometry_miles
    if 100 * (1 - uncovered_share) < MIN_ROUTE_COVERAGE_PCT:
        raise AllocationError(
            f"Route state-boundary coverage is {100 * (1 - uncovered_share):.6f}%; "
            f"minimum required is {MIN_ROUTE_COVERAGE_PCT:.3f}%. "
            "Refusing to normalize or guess the missing PADD mileage."
        )

    if expected is not None:
        expected = float(expected)
        difference = abs(geometry_miles - expected) / expected if expected else 1.0
        if expected <= 0 or difference > 0.01:
            raise AllocationError(
                f"GeoJSON length {geometry_miles:.2f} mi differs from expected "
                f"route distance {expected:.2f} mi by {difference:.2%}; inspect geometry."
            )
        scale = expected / geometry_miles
        state_miles = defaultdict(float, {state: miles * scale for state, miles in state_miles.items()})
        unmatched_miles *= scale
        route_miles = expected
    else:
        route_miles = geometry_miles

    padd_miles: dict[str, float] = defaultdict(float)
    for state, miles in state_miles.items():
        padd_miles[PADD_BY_STATE[state]] += miles

    return {
        "route_miles": round(route_miles, 3),
        "geometry_miles_before_optional_scale": round(geometry_miles, 3),
        "unmatched_miles": round(unmatched_miles, 3),
        "coverage_pct": round(100 * (1 - unmatched_miles / route_miles), 6),
        "miles_by_state": {key: round(value, 3) for key, value in sorted(state_miles.items())},
        "miles_by_padd": {key: round(value, 3) for key, value in sorted(padd_miles.items())},
        "allocation_method": f"GeoJSON route sampled at <= {step_miles:g} mile intervals; Census/TIGER state polygons",
    }


def price_fuel(allocation: dict[str, Any],
               prices: dict[str, Any],
               gallons_per_mile: float) -> dict[str, Any]:
    if not math.isfinite(gallons_per_mile) or gallons_per_mile <= 0:
        raise AllocationError("Gallons per mile must be a finite value greater than zero.")
    coverage = float(allocation.get("coverage_pct", 0.0))
    if coverage < MIN_ROUTE_COVERAGE_PCT:
        raise AllocationError(
            f"Route state-boundary coverage is {coverage:.6f}%; "
            f"minimum required is {MIN_ROUTE_COVERAGE_PCT:.3f}%. "
            "Fuel cost is not calculated until the route meets the same strict coverage gate as allocation."
        )
    price_map = prices.get("usd_per_gallon", {})
    padd_miles = allocation["miles_by_padd"]

    def price_key_for(area: str) -> str | None:
        if area in price_map:
            return area
        if area in ("1A", "1B", "1C") and "1" in price_map:
            return "1"
        if area in ("5CA", "5X") and "5" in price_map:
            return "5"
        return None

    resolved = {area: price_key_for(area) for area in padd_miles}
    missing = [area for area, key in resolved.items() if key is None]
    if missing:
        raise AllocationError(f"Missing diesel prices for EIA area(s): {', '.join(missing)}")
    by_padd = {}
    total_cost = 0.0
    for padd, miles in padd_miles.items():
        price_key = resolved[padd]
        price = float(price_map[price_key])
        if price <= 0:
            raise AllocationError(f"Invalid diesel price for EIA area {price_key}.")
        cost = miles * gallons_per_mile * price
        total_cost += cost
        by_padd[padd] = {
            "miles": round(miles, 3),
            "eia_price_series": price_key,
            "diesel_usd_per_gallon": price,
            "fuel_gallons": round(miles * gallons_per_mile, 3),
            "fuel_cost_usd": round(cost, 2),
        }
    return {
        "eia_week_of": prices.get("week_of"),
        "gallons_per_mile": gallons_per_mile,
        "fuel_only_cost_usd": round(total_cost, 2),
        "fuel_only_cost_per_truck_mile_usd": round(total_cost / allocation["route_miles"], 4),
        "by_padd": by_padd,
        "scope_warning": "Fuel only. Both allocation and pricing require at least 99.999% route-mile coverage; unmatched mileage is not silently assigned or normalized. Excludes labor, maintenance, tires, insurance, depreciation, overhead, tolls, and any deadhead not included in the supplied route.",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--route", required=True, help="GeoJSON route Feature/FeatureCollection/Geometry")
    parser.add_argument("--states", required=True, help="Census/TIGER state-boundary GeoJSON FeatureCollection")
    parser.add_argument("--prices", required=True, help="JSON with week_of and usd_per_gallon keyed by PADD 1..5")
    parser.add_argument("--gallons-per-mile", type=float, required=True, help="Fuel gallons per truck-mile; use the explicitly documented VIUS weighted estimator, not arithmetic-mean MPG (e.g. 0.122605)")
    parser.add_argument("--step-miles", type=float, default=0.25, help="Maximum sample spacing in miles (default: 0.25)")
    parser.add_argument("--output", help="Optional output JSON path; stdout if omitted")
    args = parser.parse_args()

    route = json.loads(Path(args.route).read_text(encoding="utf-8"))
    states = json.loads(Path(args.states).read_text(encoding="utf-8"))
    prices = json.loads(Path(args.prices).read_text(encoding="utf-8"))
    allocation = allocate_route(route, states, args.step_miles)
    result = {"allocation": allocation, "fuel": price_fuel(allocation, prices, args.gallons_per_mile)}
    rendered = json.dumps(result, indent=2)
    if args.output:
        Path(args.output).write_text(rendered + "\n", encoding="utf-8")
    else:
        print(rendered)


if __name__ == "__main__":
    main()
