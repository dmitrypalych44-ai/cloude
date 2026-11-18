"""Only reviewed standalone store catalogs; no classifieds or aggregators."""
from urllib.parse import urlsplit

STORE_DOMAINS = frozenset({
    '999111.ru', 'redmamont.ru', 'apexdv.ru', 'jaba-discount.ru',
    'vladivostok.santehnica.ru', 'reserv-stroy.ru', 'dunavl.ru',
})

def is_store_url(url):
    try:
        parsed = urlsplit(str(url))
        host = (parsed.hostname or '').lower().removeprefix('www.')
        return parsed.scheme == 'https' and host in STORE_DOMAINS
    except ValueError:
        return False
