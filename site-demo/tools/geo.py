"""Regenerates js/uz-geo.js (map outlines). Inputs, downloaded next to this script:
  geoBoundaries-UZB-ADM1_simplified.geojson  https://www.geoboundaries.org (UZB, ADM1, CC BY 4.0)
  ne_50m_admin_0_countries.geojson           https://www.naturalearthdata.com (public domain)
Usage: python3 tools/geo.py"""
import json, math, os
SP = os.path.dirname(os.path.abspath(__file__)) + '/'
OUT = os.path.join(SP, '..', 'js', 'uz-geo.js')
LON0, LAT0, K = 55.6, 46.0, 60.0
C = math.cos(math.radians(41.0))


def P(lon, lat):
    return ((lon - LON0) * C * K, (LAT0 - lat) * K)


def dp(pts, eps):
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy) or 1e-9
    imax, dmax = 0, 0
    for i in range(1, len(pts) - 1):
        x, y = pts[i]
        d = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / L
        if d > dmax:
            imax, dmax = i, d
    if dmax > eps:
        return dp(pts[:imax + 1], eps)[:-1] + dp(pts[imax:], eps)
    return [pts[0], pts[-1]]


def rings(geom):
    if geom['type'] == 'Polygon':
        return [geom['coordinates'][0]]
    return [p[0] for p in geom['coordinates']]


def path(geom, eps, minlen=3):
    out = []
    for r in rings(geom):
        pts = [P(*c[:2]) for c in r]
        m = len(pts) // 2
        s = dp(pts[:m + 1], eps)[:-1] + dp(pts[m:], eps)
        if len(s) < minlen:
            continue
        out.append('M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in s) + 'Z')
    return ''.join(out)


NAMES = {'Andijan Region': 'Андижан', 'Namangan Region': 'Наманган', 'Fergana Region': 'Фергана', 'Republic of Karakalpakstan': 'Каракалпакстан',
         'Xorazm Region': 'Хорезм', 'Navoiy Region': 'Навои', 'Surxondaryo Region': 'Сурхандарья', 'Samarqand Region': 'Самарканд',
         'Tashkent Region': 'Ташкентская обл.', 'Sirdaryo Region': 'Сырдарья', 'Jizzakh Region': 'Джизак', 'Bukhara Region': 'Бухара',
         'Qashqadaryo Region': 'Кашкадарья', 'Tashkent': 'Ташкент'}
d = json.load(open(SP + 'geoBoundaries-UZB-ADM1_simplified.geojson'))
regions = [{'n': NAMES[f['properties']['shapeName']], 'd': path(f['geometry'], .7)} for f in d['features']]
w = json.load(open(SP + 'ne_50m_admin_0_countries.geojson'))
nb = []
for f in w['features']:
    if f['properties']['ADM0_A3'] in ('KAZ', 'TKM', 'TJK', 'KGZ', 'AFG'):
        nb.append(path(f['geometry'], 1.2))
W, H = P(73.4, 37.0)
out = {'w': round(W), 'h': round(H), 'lon0': LON0, 'lat0': LAT0, 'k': K, 'c': C, 'regions': regions, 'nb': ''.join(nb)}
s = json.dumps(out, ensure_ascii=False, separators=(',', ':'))
open(OUT, 'w').write('/* Узбекистан: границы областей (geoBoundaries ADM1, CC BY 4.0) и соседи (Natural Earth). Проекция: x=(lon-lon0)*c*k, y=(lat0-lat)*k */\nwindow.UZ_GEO=' + s + ';\n')
print(len(s), W, H)
