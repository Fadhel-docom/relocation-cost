import tempfile
import unittest
from pathlib import Path

import shapefile

from tools.fetch_tiger_state_boundaries import EXPECTED_STATES, convert_shapefile


def write_fixture(root: Path, postal_codes: list[str]) -> Path:
    base = root / 'tl_2026_us_state'
    writer = shapefile.Writer(str(base), shapeType=shapefile.POLYGON)
    writer.field('STATEFP', 'C', size=2)
    writer.field('STUSPS', 'C', size=2)
    writer.field('NAME', 'C', size=40)
    writer.autoBalance = 1
    for index, postal in enumerate(postal_codes):
        west = -160 + (index % 10) * 2
        south = 10 + (index // 10) * 2
        writer.poly([[[west, south], [west + 1, south], [west + 1, south + 1], [west, south + 1], [west, south]]])
        writer.record(f'{index % 56:02d}', postal, f'State {postal}')
    writer.close()
    base.with_suffix('.prj').write_text('GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983"],UNIT["Degree",0.0174532925199433]]', encoding='utf-8')
    return base.with_suffix('.shp')


class TigerBoundaryConversionTests(unittest.TestCase):
    def test_converts_exactly_50_states_and_dc_in_sorted_order(self):
        with tempfile.TemporaryDirectory() as directory:
            shp = write_fixture(Path(directory), sorted(EXPECTED_STATES))
            features = convert_shapefile(shp)
        self.assertEqual(len(features), 51)
        self.assertEqual([f['properties']['STUSPS'] for f in features], sorted(EXPECTED_STATES))
        self.assertTrue(all(f['geometry']['type'] == 'Polygon' for f in features))

    def test_rejects_missing_state_or_dc(self):
        with tempfile.TemporaryDirectory() as directory:
            shp = write_fixture(Path(directory), sorted(EXPECTED_STATES - {'DC'}))
            with self.assertRaisesRegex(RuntimeError, 'Expected exactly 50 states'):
                convert_shapefile(shp)

    def test_rejects_duplicate_state_code(self):
        with tempfile.TemporaryDirectory() as directory:
            shp = write_fixture(Path(directory), sorted(EXPECTED_STATES) + ['KY'])
            with self.assertRaisesRegex(RuntimeError, 'Duplicate state feature'):
                convert_shapefile(shp)

    def test_rejects_unverified_coordinate_reference(self):
        with tempfile.TemporaryDirectory() as directory:
            shp = write_fixture(Path(directory), sorted(EXPECTED_STATES))
            shp.with_suffix('.prj').write_text('PROJCS["unknown projected CRS"]', encoding='utf-8')
            with self.assertRaisesRegex(RuntimeError, 'Expected geographic NAD83'):
                convert_shapefile(shp)


if __name__ == '__main__':
    unittest.main()
