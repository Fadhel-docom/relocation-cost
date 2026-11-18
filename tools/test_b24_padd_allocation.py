import unittest

from tools.b24_padd_allocation import (
    AllocationError,
    allocate_route,
    price_fuel,
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


if __name__ == "__main__":
    unittest.main()
