#!/usr/bin/env python3
"""Focused unit tests for the VIUS per-record fuel aggregation."""
import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name("b24-vius-box-truck-extract.py")
SPEC = importlib.util.spec_from_file_location("b24_vius_extract", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class WeightedGallonsPerMileTests(unittest.TestCase):
    def test_transform_before_weighting_differs_from_inverse_mean_mpg(self):
        rows = [
            {"MPG": "10", "TABWEIGHT": "1", "RGROUP": "1"},
            {"MPG": "20", "TABWEIGHT": "1", "RGROUP": "2"},
        ]
        result = MODULE.weighted_transform_estimate(rows, "MPG", lambda mpg: 1 / mpg)
        self.assertAlmostEqual(result["mean"], 0.075)
        self.assertNotAlmostEqual(result["mean"], 1 / 15)

    def test_tabweight_is_applied_to_record_level_gallons_per_mile(self):
        rows = [
            {"MPG": "10", "TABWEIGHT": "3", "RGROUP": "1"},
            {"MPG": "20", "TABWEIGHT": "1", "RGROUP": "2"},
        ]
        result = MODULE.weighted_transform_estimate(rows, "MPG", lambda mpg: 1 / mpg)
        self.assertAlmostEqual(result["mean"], 0.0875)
        self.assertEqual(result["valid_records"], 2)
        self.assertAlmostEqual(result["weight_sum"], 4)

    def test_invalid_nonpositive_mpg_and_weights_are_excluded(self):
        rows = [
            {"MPG": "10", "TABWEIGHT": "1", "RGROUP": "1"},
            {"MPG": "0", "TABWEIGHT": "1", "RGROUP": "1"},
            {"MPG": "-2", "TABWEIGHT": "1", "RGROUP": "2"},
            {"MPG": "20", "TABWEIGHT": "0", "RGROUP": "2"},
            {"MPG": "30", "TABWEIGHT": "1", "RGROUP": ""},
        ]
        result = MODULE.weighted_transform_estimate(rows, "MPG", lambda mpg: 1 / mpg)
        self.assertAlmostEqual(result["mean"], 0.1)
        self.assertEqual(result["valid_records"], 1)
        self.assertEqual(result["nonempty_random_groups"], 1)
        self.assertIsNone(result["cv_pct"])

    def test_random_group_cv_uses_group_ratio_estimates(self):
        rows = [
            {"MPG": "10", "TABWEIGHT": "1", "RGROUP": "1"},
            {"MPG": "20", "TABWEIGHT": "1", "RGROUP": "2"},
        ]
        result = MODULE.weighted_transform_estimate(rows, "MPG", lambda mpg: 1 / mpg)
        self.assertAlmostEqual(result["cv_pct"], 100 / 3, places=6)
        self.assertEqual(result["nonempty_random_groups"], 2)


if __name__ == "__main__":
    unittest.main()
