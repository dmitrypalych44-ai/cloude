"""Run with PYTHONPATH=.cache/report-libs python -m unittest discover -s tests."""
import unittest
from collections import Counter
from urllib.parse import urlsplit, parse_qsl
from openpyxl import load_workbook

class ReportTests(unittest.TestCase):
    def test_report(self):
        w = load_workbook('reports/competitor_matches.xlsx', data_only=True)
        rows = list(w['Соответствия'].values)[1:]
        self.assertEqual(len(rows), 104)
        self.assertEqual(len({r[0] for r in rows}), 78)
        self.assertEqual(w['Все 1518 артикулов'].max_row, 1519)
        normalized = [(r[0], urlsplit(r[5]).netloc, urlsplit(r[5]).path,
                       tuple(sorted(parse_qsl(urlsplit(r[5]).query)))) for r in rows]
        self.assertEqual(len(normalized), len(set(normalized)))
        self.assertFalse(any(r[0] == '83024081' and '482853-' in r[5] for r in rows))
        self.assertTrue(any(r[0] == '83024081' and '491116-' in r[5] for r in rows))
        source_ids = {r[0] for r in list(w['Все 1518 артикулов'].values)[1:]}
        self.assertTrue(all(r[0] in source_ids and r[5].startswith('https://') for r in rows))
        self.assertEqual(sum('ДРУГАЯ фасовка' in r[6] for r in rows), 39)
        self.assertEqual(sum('Кандидат по характеристикам' in r[6] for r in rows), 2)
        w.close()

if __name__ == '__main__':
    unittest.main()
