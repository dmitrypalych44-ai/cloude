"""Run with PYTHONPATH=.cache/report-libs python -m unittest discover -s tests."""
import unittest
from collections import Counter
from urllib.parse import urlsplit, parse_qsl
from openpyxl import load_workbook

class ReportTests(unittest.TestCase):
    def test_report(self):
        w = load_workbook('reports/competitor_matches.xlsx', data_only=True)
        rows = list(w['Соответствия'].values)[1:]
        self.assertEqual(len(rows), 107)
        self.assertEqual(len({r[0] for r in rows}), 81)
        self.assertEqual(w['Все 1518 артикулов'].max_row, 1519)
        normalized = [(r[0], urlsplit(r[5]).netloc, urlsplit(r[5]).path,
                       tuple(sorted(parse_qsl(urlsplit(r[5]).query)))) for r in rows]
        self.assertEqual(len(normalized), len(set(normalized)))
        self.assertFalse(any(r[0] == '83024081' and '482853-' in r[5] for r in rows))
        self.assertTrue(any(r[0] == '83024081' and '491116-' in r[5] for r in rows))
        source_ids = {r[0] for r in list(w['Все 1518 артикулов'].values)[1:]}
        self.assertTrue(all(r[0] in source_ids and r[5].startswith('https://') for r in rows))
        self.assertEqual(sum('ДРУГАЯ фасовка' in r[8] for r in rows), 40)
        self.assertEqual(sum('Кандидат по характеристикам' in r[8] for r in rows), 2)
        self.assertEqual(w['Соответствия']['G1'].value, 'Ссылка Лемана ПРО')
        self.assertTrue(all('lemanapro.ru/' in r[6] and r[7] for r in rows))
        for r in rows:
            self.assertEqual(r[6], 'https://vladivostok.lemanapro.ru/search/?q=' + r[0])
            self.assertIn('НЕ карточка', r[7])
        for r in list(w['Все 1518 артикулов'].values)[1:]:
            self.assertEqual(r[5], 'https://vladivostok.lemanapro.ru/search/?q=' + r[0])
        for row in w['Соответствия'].iter_rows(min_row=2):
            self.assertEqual(row[5].hyperlink.target, row[5].value)
            self.assertEqual(row[6].hyperlink.target, row[6].value)
        w.close()

if __name__ == '__main__':
    unittest.main()
