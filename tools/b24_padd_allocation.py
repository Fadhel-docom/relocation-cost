"""Research-only PADD mileage allocation for route GeoJSON.

Requires a GeoJSON FeatureCollection of U.S. state polygons with STUSPS properties.
No external GIS dependency is required. Distances are sampled along the supplied road
polyline; uncovered or materially mismatched routes are rejected rather than guessed.
"""
from __future__ import annotations

import math


class AllocationError(ValueError):
    """Raised when a route cannot be allocated to a known PADD with adequate QA."""


EARTH_RADIUS_MILES = 3958.7613
PADD1A = {"CT", "ME", "MA", "NH", "RI", "VT"}
PADD1B = {"DE", "DC", "MD", "NJ", "NY", "PA"}
PADD1C = {"FL", "GA", "NC", "SC", "VA", "WV"}
PADD2 = {"IL", "IN", "IA", "KS", "KY", "MI", "MN", "MO", "NE", "ND", "OH", "OK", "SD", "TN", "WI"}
PADD3 = {"AL", "AR", "LA", "MS", "NM", "TX"}
PADD4 = {"CO", "ID", "MT", "UT", "WY"}
PADD5 = {"AK", "AZ", "CA", "HI", "NV", "OR", "WA"}


def padd_for_state(state):
    if state in PADD1A:
        return "1A"
    if state in PADD1B:
        return "1B"
    if state in PADD1C:
        return "1C"
    for code, states in (("2", PADD2), ("3", PADD3), ("4", PADD4), ("5", PADD5)):
        if state in states:
            return code
    raise AllocationError(f"State {state!r} has no configured EIA PADD mapping")


def haversine_miles(a, b):
    lon1, lat1 = map(math.radians, a[:2])
    lon2, lat2 = map(math.radians, b[:2])
    dlat, dlon = lat2 - lat1, lon2 - lon1
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 2 * EARTH_RADIUS_MILES * math.asin(min(1.0, math.sqrt(h)))


def _on_segment(point, a, b, eps=1e-10):
    x, y = point
    cross = (x - a[0]) * (b[1] - a[1]) - (y - a[1]) * (b[0] - a[0])
    if abs(cross) > eps:
        return False
    return (min(a[0], b[0]) - eps <= x <= max(a[0], b[0]) + eps
            and min(a[1], b[1]) - eps <= y <= max(a[1], b[1]) + eps)


def _point_in_ring(point, ring):
    inside = False
    if len(ring) < 4:
        return False
    x, y = point
    for i in range(len(ring) - 1):
        a, b = ring[i], ring[i + 1]
        if _on_segment(point, a, b):
            return True
        if (a[1] > y) != (b[1] > y):
            cross_x = (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]
            if x < cross_x:
                inside = not inside
    return inside


def _point_in_polygon(point, rings):
    if not rings or not _point_in_ring(point, rings[0]):
        return False
    return not any(_point_in_ring(point, hole) for hole in rings[1:])


def _geometry_contains(geometry, point):
    kind = geometry.get("type")
    coords = geometry.get("coordinates", [])
    if kind == "Polygon":
        return _point_in_polygon(point, coords)
    if kind == "MultiPolygon":
        return any(_point_in_polygon(point, polygon) for polygon in coords)
    raise AllocationError(f"Unsupported state geometry type: {kind!r}")


def _features_for_point(point, states):
    matches = []
    for feature in states.get("features", []):
        props = feature.get("properties") or {}
        state = props.get("STUSPS")
        if state and _geometry_contains(feature.get("geometry") or {}, point):
            matches.append((state, padd_for_state(state)))
    if not matches:
        raise AllocationError(f"Route sample {point!r} is outside supplied state polygons")
    padds = {padd for _, padd in matches}
    if len(padds) > 1:
        raise AllocationError(f"Ambiguous PADD assignment at state boundary: {matches!r}")
    return next(iter(padds))


def _route_lines(route):
    obj = route
    if obj.get("type") == "Feature":
        obj = obj.get("geometry") or {}
    if obj.get("type") == "FeatureCollection":
        lines = []
        for feature in obj.get("features", []):
            lines.extend(_route_lines(feature))
        return lines
    if obj.get("type") == "LineString":
        return [obj.get("coordinates", [])]
    if obj.get("type") == "MultiLineString":
        return obj.get("coordinates", [])
    raise AllocationError(f"Unsupported route geometry type: {obj.get('type')!r}")


def allocate_route(route, states, step_miles=0.25, distance_tolerance_pct=1.0):
    if not isinstance(step_miles, (int, float)) or step_miles <= 0:
        raise AllocationError("step_miles must be positive")
    props = route.get("properties") or {}
    if props.get("stored_distance_match") is False:
        raise AllocationError("Stored road-distance matrix does not match route geometry")
    stored_diff = props.get("stored_distance_difference_pct")
    if stored_diff is not None and abs(float(stored_diff)) > distance_tolerance_pct:
        raise AllocationError("Stored road-distance matrix differs from route geometry by over tolerance")

    miles_by_padd = {}
    route_miles = 0.0
    sampled_miles = 0.0
    for line in _route_lines(route):
        if len(line) < 2:
            raise AllocationError("Route line has fewer than two coordinates")
        for start, end in zip(line, line[1:]):
            segment_miles = haversine_miles(start, end)
            if segment_miles <= 0:
                continue
            steps = max(1, math.ceil(segment_miles / step_miles))
            portion = segment_miles / steps
            for index in range(steps):
                fraction = (index + 0.5) / steps
                point = (
                    start[0] + (end[0] - start[0]) * fraction,
                    start[1] + (end[1] - start[1]) * fraction,
                )
                padd = _features_for_point(point, states)
                miles_by_padd[padd] = miles_by_padd.get(padd, 0.0) + portion
                sampled_miles += portion
            route_miles += segment_miles

    if route_miles <= 0:
        raise AllocationError("Route geometry has no positive length")
    if abs(sampled_miles - route_miles) > 0.02:
        raise AllocationError("PADD allocation failed mileage conservation")

    expected = props.get("expected_distance_miles")
    if expected is not None:
        expected = float(expected)
        difference_pct = abs(route_miles - expected) / expected * 100 if expected else float("inf")
        if difference_pct > distance_tolerance_pct:
            raise AllocationError(
                f"Route geometry differs from stored road-distance matrix by {difference_pct:.2f}%"
            )

    return {
        "route_miles": route_miles,
        "miles_by_padd": dict(sorted(miles_by_padd.items())),
        "sample_step_miles": float(step_miles),
        "mileage_conservation_error_miles": sampled_miles - route_miles,
        "expected_distance_miles": expected,
    }


def price_fuel(allocation, prices, mpg=None, gallons_per_mile=None):
    if (mpg is None) == (gallons_per_mile is None):
        raise AllocationError("Provide exactly one of mpg or gallons_per_mile")
    if mpg is not None:
        if not isinstance(mpg, (int, float)) or mpg <= 0:
            raise AllocationError("mpg must be positive")
        gallons_per_mile = 1.0 / mpg
    if not isinstance(gallons_per_mile, (int, float)) or gallons_per_mile <= 0:
        raise AllocationError("gallons_per_mile must be positive")

    price_map = prices.get("usd_per_gallon") or {}
    by_padd = {}
    total_cost = 0.0
    for padd, miles in allocation.get("miles_by_padd", {}).items():
        price_key = padd
        if price_key not in price_map and padd in {"1A", "1B", "1C"} and "1" in price_map:
            price_key = "1"
        if padd == "5" and "CA" in price_map:
            # California is a separately published EIA subregion.
            raise AllocationError("PADD 5 mileage must be split into California and non-California geometry before pricing")
        if price_key not in price_map:
            raise AllocationError(f"Missing EIA diesel price for PADD {padd}")
        price = float(price_map[price_key])
        fuel_cost = float(miles) * gallons_per_mile * price
        total_cost += fuel_cost
        by_padd[padd] = {
            "miles": float(miles),
            "eia_price_series": price_key,
            "usd_per_gallon": price,
            "gallons_per_mile": gallons_per_mile,
            "fuel_only_cost_usd": fuel_cost,
        }
    return {
        "week_of": prices.get("week_of"),
        "gallons_per_mile": gallons_per_mile,
        "fuel_only_cost_usd": total_cost,
        "fuel_only_usd_per_truck_mile": total_cost / allocation["route_miles"],
        "by_padd": by_padd,
    }
