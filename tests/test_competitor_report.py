"""PYTHONPATH=.cache/report-libs python -m unittest discover -s tests"""
import sys
import unittest
from pathlib import Path
from urllib.parse import urlsplit, parse_qsl
from openpyxl import load_workbook
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from package_check import package, verdict, label

class PackageTests(unittest.TestCase):
    def test_units(self):
        self.assertEqual(package('0,28 л'), package('280 мл'))
        self.assertEqual(package('2КГ'), package('2000 г'))
        self.assertNotEqual(package('0,5 л'), package('0,5 кг'))
        self.assertEqual(label(package('CE33/2 затирка', True)), '2 кг')
        self.assertIsNone(package('CL51/5'))
        self.assertIsNone(package('8,5х28,5'))
        self.assertIsNone(package('5 кг / 25 кг'))
        self.assertEqual(label(package('8,5х28,5 0,97М2')), '0.97 м²/уп')
        self.assertEqual(verdict('2 кг', '2,5 кг')[2], 'Разная фасовка')
        self.assertNotEqual(verdict('50 шт', '250 шт')[2], 'Совпадает по описаниям')

class ReportTests(unittest.TestCase):
    def test_report(self):
        w = load_workbook('reports/competitor_matches.xlsx', data_only=True)
        rows = list(w['Соответствия'].values)[1:]
        excluded = list(w['Исключено и проверить'].values)[1:]
        self.assertEqual((len(rows), len(excluded)), (135, 57))
        self.assertEqual(len({r[0] for r in rows}), 128)
        self.assertGreater(len({r[0] for r in rows}), 100)
        self.assertEqual(w['Все 1518 артикулов'].max_row, 1519)
        normalized = [(r[0], urlsplit(r[5]).netloc, urlsplit(r[5]).path,
                       tuple(sorted(parse_qsl(urlsplit(r[5]).query)))) for r in rows + excluded]
        self.assertEqual(len(normalized), len(set(normalized)))
        for r in rows:
            self.assertEqual(r[15], r[16])
            self.assertNotEqual(r[15], 'Не установлено')
            self.assertEqual(r[17], 'Совпадает по описаниям')
            self.assertNotIn('ДРУГАЯ фасовка', r[8])
        self.assertEqual(sum(r[17] == 'Разная фасовка' for r in excluded), 40)
        self.assertTrue(any(r[0] == '83024081' and '491116-' in r[5] for r in excluded))
        self.assertTrue(any(r[0] == '17358455' and 'farpost.ru' in r[5] for r in rows))
        for r in rows + excluded:
            self.assertEqual(r[6], 'https://vladivostok.lemanapro.ru/search/?q=' + r[0])
        for sheet in ('Соответствия', 'Исключено и проверить'):
            for row in w[sheet].iter_rows(min_row=2):
                self.assertEqual(row[5].hyperlink.target, row[5].value)
                self.assertEqual(row[6].hyperlink.target, row[6].value)
        w.close()

if __name__ == '__main__':
    unittest.main()
