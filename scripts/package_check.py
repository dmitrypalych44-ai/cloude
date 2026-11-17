"""Conservative net-pack extraction. Never equate mass with liquid volume."""
import re
from decimal import Decimal

UNITS = {'кг': ('кг', 1), 'kg': ('кг', 1), 'г': ('кг', '.001'),
         'мл': ('л', '.001'), 'ml': ('л', '.001'), 'л': ('л', 1),
         'l': ('л', 1), 'шт': ('шт', 1), 'sht': ('шт', 1), 'м2': ('м²/уп', 1), 'м²': ('м²/уп', 1)}

def package(text, source=False):
    text = str(text).lower()
    # A comma after a model word separates the pack (STONE,1кг),
    # whereas a comma after a digit remains a decimal separator (0,5кг).
    text = re.sub(r'(?<=[a-zа-я]),(?=\d)', ' ', text)
    found = []
    for m in re.finditer(r'(?<![\d.,])(\d+(?:[.,]\d+)?)\s*(кг|kg|мл|ml|шт|sht|м2|м²|л|l|г)(?![a-zа-я0-9])', text):
        value = Decimal(m[1].replace(',', '.'))
        unit, factor = UNITS[m[2]]
        pair = (value * Decimal(str(factor)), unit)
        if pair not in found:
            found.append(pair)
    if not found and source:
        # Explicit shorthand in supplied grout names: CE33/2 and CE40/2.
        m = re.search(r'c[eе]\s*(?:33|40)\s*/\s*(\d+(?:[.,]\d+)?)\b', text)
        if m:
            found = [(Decimal(m[1].replace(',', '.')), 'кг')]
    return found[0] if len(found) == 1 else None

def label(pack):
    if pack is None:
        return 'Не установлено'
    return f'{format(pack[0].normalize(), "f")} {pack[1]}'

def verdict(source_text, competitor_text):
    a, b = package(source_text, True), package(competitor_text)
    if a is None or b is None:
        return a, b, 'Не подтверждено: нет однозначных данных об упаковке'
    if a == b:
        return a, b, 'Совпадает по описаниям'
    if a[1] != b[1]:
        return a, b, 'Несопоставимые единицы: массу не переводим в объём'
    return a, b, 'Разная фасовка'
