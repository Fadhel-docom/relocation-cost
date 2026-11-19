import unittest

from tools.b24_padd_allocation import (
    AllocationError,
    allocate_route,
    price_fuel,
    PADD_BY_STATE,
)


def box(state, west, east):
    return {
        "type": "Feature",
        "properties": {"STUSPS": state},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [west, 34], [east, 34], [east, 36], [west, 36], [west, 34]
            ]],
        },
    }


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

    def test_every_state_and_dc_has_a_padd_assignment(self):
        from tools.b24_padd_allocation import PADD_BY_STATE
        self.assertEqual(set(PADD_BY_STATE), set("AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC".split()))
        self.assertEqual(PADD_BY_STATE["KY"], "2")

    def test_route_through_kentucky_is_allocated_to_padd2(self):
        states = {"type": "FeatureCollection", "features": [box("KY", -85, -83)]}
        route = {"type": "LineString", "coordinates": [[-84.9, 35], [-83.1, 35]]}
        result = allocate_route(route, states, step_miles=0.25)
        self.assertGreater(result["miles_by_padd"]["2"], 100)

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
        fuel = price_fuel(result, prices, gallons_per_mile=0.1)
        expected = (
            result["miles_by_padd"]["2"] * 4.0 * 0.1
            + result["miles_by_padd"]["3"] * 3.0 * 0.1
        )
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
                {
                    "type": "Feature",
                    "properties": {"STUSPS": "MA"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                            [-80, 40], [-70, 40], [-70, 43], [-80, 43], [-80, 40]
                        ]],
                    },
                },
                {
                    "type": "Feature",
                    "properties": {"STUSPS": "NC"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                            [-80, 34], [-70, 34], [-70, 40], [-80, 40], [-80, 34]
                        ]],
                    },
                },
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
        fuel = price_fuel(allocation, prices, gallons_per_mile=0.1)
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
                {
                    "type": "Feature",
                    "properties": {"STUSPS": "MA"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                            [-80, 40], [-70, 40], [-70, 43], [-80, 43], [-80, 40]
                        ]],
                    },
                },
                {
                    "type": "Feature",
                    "properties": {"STUSPS": "NC"},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                            [-80, 34], [-70, 34], [-70, 40], [-80, 40], [-80, 34]
                        ]],
                    },
                },
            ],
        }
        route = {"type": "LineString", "coordinates": [[-75, 42.5], [-75, 34.5]]}
        allocation = allocate_route(route, states, step_miles=0.25)
        fuel = price_fuel(
            allocation,
            {"week_of": "2026-11-16", "usd_per_gallon": {"1": 5.782}},
            gallons_per_mile=0.1,
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

    def test_prices_at_the_shared_99_5_percent_coverage_threshold_without_renormalizing(self):
        allocation = {
            "route_miles": 100.0,
            "coverage_pct": 99.5,
            "miles_by_padd": {"2": 99.5},
        }
        prices = {"week_of": "2026-11-16", "usd_per_gallon": {"2": 4.0}}
        fuel = price_fuel(allocation, prices, gallons_per_mile=0.1)
        self.assertAlmostEqual(fuel["fuel_only_cost_usd"], 39.8, places=2)
        self.assertAlmostEqual(fuel["fuel_only_cost_per_truck_mile_usd"], 0.398, places=3)

    def test_refuses_to_price_any_unmatched_route_mileage(self):
        allocation = {
            "route_miles": 100.0,
            "coverage_pct": 99.49,
            "miles_by_padd": {"2": 99.5},
        }
        prices = {"week_of": "2026-11-16", "usd_per_gallon": {"2": 4.0}}
        with self.assertRaisesRegex(AllocationError, "minimum required"):
            price_fuel(allocation, prices, gallons_per_mile=0.1)

    def test_refuses_distance_mismatch_over_one_percent(self):
        route = {
            "type": "Feature",
            "properties": {"expected_distance_miles": 1000},
            "geometry": self.route["geometry"],
        }
        with self.assertRaises(AllocationError):
            allocate_route(route, self.states, step_miles=0.25)


    def test_kentucky_is_mapped_to_padd2(self):
        self.assertEqual(PADD_BY_STATE["KY"], "2")

    def test_rejects_coverage_below_shared_threshold(self):
        allocation = {"route_miles": 100.0, "coverage_pct": 99.9, "miles_by_padd": {"2": 99.9}}
        prices = {"week_of": "2026-11-16", "usd_per_gallon": {"2": 4.0}}
        with self.assertRaisesRegex(AllocationError, "minimum required"):
            price_fuel(allocation, prices, gallons_per_mile=0.1)


if __name__ == "__main__":
    unittest.main()
