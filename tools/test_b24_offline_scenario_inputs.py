import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class B24ScenarioInputTests(unittest.TestCase):
    def test_crew_hours_are_explicitly_scenarios_not_evidence(self):
        data = json.loads((ROOT / "data/research/b24-crew-hours-scenarios-2026-11-26.json").read_text())
        self.assertIn("not_empirical_evidence", data["status"])
        self.assertEqual(set(data["scenarios"]), {"low", "base", "high"})
        for scenario in data["scenarios"].values():
            self.assertEqual(set(scenario["crew_man_hours_by_size"]), {"1", "1.35", "1.8", "2.4"})
            self.assertTrue(all(v > 0 for v in scenario["crew_man_hours_by_size"].values()))

    def test_scenario_hours_increase_monotonically(self):
        data = json.loads((ROOT / "data/research/b24-crew-hours-scenarios-2026-11-26.json").read_text())
        for size in ("1", "1.35", "1.8", "2.4"):
            values = [data["scenarios"][key]["crew_man_hours_by_size"][size] for key in ("low", "base", "high")]
            self.assertEqual(values, sorted(values))
            self.assertEqual(len(set(values)), 3)


if __name__ == "__main__":
    unittest.main()
