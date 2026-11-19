import unittest

from tools.b24_padd_allocation import (
    AllocationError,
    allocate_route,
    price_fuel,
)


def region(state, west, east, south, north):
    return {
        "type": "Feature",
        "properties": {"STUSPS": state},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [west, south], [east, south], [east, north], [west, north], [west, south]
            ]],
        },
    }


def box(state, west, east):
    return region(state, west, east, 34, 36)


class PaddAllocationTests(unittest.TestCase):
    def setUp(self):
        self.states = {
            "type": "FeatureCollection",
            "features": [box("TX", -101, -99), box("OK", -99, -97)],
        }
        self.route = {
            "type": "Feature",
            "properties": {"expected_distance_miles": 215.0595},
            "geometry": {
                "type": "LineString",
                "coordinates": [[-100.9, 35], [-97.1, 35]],
            },
        }

    def test_crosses_padd_boundary_and_conserves_mileage(self):
        result = allocate_route(self.route, self.states, step_miles=0.25)
        self.assertGreater(result["miles_by_padd"]["2"], 100)
        self.assertGreater(result["miles_by_padd"]["3"], 100)
        self.assertAlmostEqual(
            sum(result["miles_by_padd"].values()),
            result["route_miles"],
            delta=0.02,
        )

    def test_fuel_cost_is_weighted_by_route_mileage(self):
        result = allocate_route(self.route, self.states, step_miles=0.25)
        prices = {"week_of": "2026-11-16", "usd_per_gallon": {"2": 4.0, "3": 3.0}}
        fuel = price_fuel(result, prices, mpg=10.0)
        expected = (
            result["miles_by_padd"]["2"] * 4.0
            + result["miles_by_padd"]["3"] * 3.0
        ) / 10.0
        self.assertAlmostEqual(fuel["fuel_only_cost_usd"], expected, delta=0.02)

    def test_refuses_uncovered_route(self):
        route = {
            "type": "LineString",
            "coordinates": [[-120, 40], [-119, 40]],
        }
        with self.assertRaises(AllocationError):
            allocate_route(route, self.states, step_miles=0.25)

    def test_uses_eia_padd1_subdistrict_prices(self):
        states = {
            "type": "FeatureCollection",
            "features": [
                region("MA", -80, -70, 40, 43),
                region("NC", -80, -70, 34, 40),
            ],
        }
        route = {
            "type": "LineString",
            "coordinates": [[-75, 42.5], [-75, 34.5]],
        }
        allocation = allocate_route(route, states, step_miles=0.25)
        self.assertIn("1A", allocation["miles_by_padd"])
        self.assertIn("1C", allocation["miles_by_padd"])
        prices = {"week_of": "2026-11-16", "usd_per_gallon": {"1A": 6.225, "1C": 5.541}}
        fuel = price_fuel(allocation, prices, mpg=10.0)
        expected = (
            allocation["miles_by_padd"]["1A"] * 6.225
            + allocation["miles_by_padd"]["1C"] * 5.541
        ) / 10.0
        self.assertAlmostEqual(fuel["fuel_only_cost_usd"], expected, delta=0.02)
        self.assertEqual(fuel["by_padd"]["1A"]["eia_price_series"], "1A")

    def test_falls_back_to_aggregate_padd1_price_when_subdistrict_missing(self):
        states = {
            "type": "FeatureCollection",
            "features": [
                region("MA", -80, -70, 40, 43),
                region("NC", -80, -70, 34, 40),
            ],
        }
        route = {"type": "LineString", "coordinates": [[-75, 42.5], [-75, 34.5]]}
        allocation = allocate_route(route, states, step_miles=0.25)
        fuel = price_fuel(
            allocation,
            {"week_of": "2026-11-16", "usd_per_gallon": {"1": 5.782}},
            mpg=10.0,
        )
        self.assertEqual(fuel["by_padd"]["1A"]["eia_price_series"], "1")
        self.assertEqual(fuel["by_padd"]["1C"]["eia_price_series"], "1")

    def test_refuses_route_when_stored_matrix_distance_differs(self):
        route = {
            "type": "Feature",
            "properties": {
                "expected_distance_miles": 215.0595,
                "stored_distance_match": False,
                "stored_distance_difference_pct": 2.3,
            },
            "geometry": self.route["geometry"],
        }
        with self.assertRaisesRegex(AllocationError, "Stored road-distance matrix"):
            allocate_route(route, self.states, step_miles=0.25)

    def test_refuses_distance_mismatch_over_one_percent(self):
        route = {
            "type": "Feature",
            "properties": {"expected_distance_miles": 1000},
            "geometry": self.route["geometry"],
        }
        with self.assertRaises(AllocationError):
            allocate_route(route, self.states, step_miles=0.25)

    def test_separates_california_from_non_california_west_coast(self):
        states = {
            "type": "FeatureCollection",
            "features": [
                region("CA", -120, -119, 40, 42),
                region("WA", -120, -119, 42, 44),
            ],
        }
        route = {"type": "LineString", "coordinates": [[-119.5, 40.2], [-119.5, 43.8]]}
        allocation = allocate_route(route, states, step_miles=0.25)
        self.assertIn("CA", allocation["miles_by_padd"])
        self.assertIn("5X", allocation["miles_by_padd"])
        fuel = price_fuel(
            allocation,
            {"week_of": "2026-11-16", "usd_per_gallon": {"CA": 7.733, "5EXCA": 6.269}},
            mpg=10.0,
        )
        self.assertEqual(fuel["by_padd"]["CA"]["eia_price_series"], "CA")
        self.assertEqual(fuel["by_padd"]["5X"]["eia_price_series"], "5EXCA")


if __name__ == "__main__":
    unittest.main()
