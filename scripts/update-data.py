#!/usr/bin/env python3
"""
Relevé des prix du fioul domestique et du propane (EIA + NYSERDA) → src/data/eia.json et src/data/ny.json.

Sources (domaine public / données ouvertes, aucune clé d'API) :
- EIA, State Heating Oil and Propane Program (SHOPP), séries hebdomadaires « Download Series History » :
  https://www.eia.gov/dnav/pet/xls/PET_PRI_WFR_A_EPD2F_PRS_DPGAL_W.xls  (fioul n° 2, prix résidentiel)
  https://www.eia.gov/dnav/pet/xls/PET_PRI_WFR_A_EPLLPA_PRS_DPGAL_W.xls (propane, prix résidentiel)
  https://www.eia.gov/dnav/pet/xls/PET_PRI_WFR_A_EPD2F_PWR_DPGAL_W.xls  (fioul n° 2, prix de gros)
  https://www.eia.gov/dnav/pet/xls/PET_PRI_WFR_A_EPLLPA_PWR_DPGAL_W.xls (propane, prix de gros)
  Prix en dollars par gallon, HORS TAXES, relevés chaque lundi d'octobre à mars, publiés le mercredi.
  Réutilisation : https://www.eia.gov/about/copyrights_reuse.php (domaine public, citer l'EIA).
- NYSERDA sur data.ny.gov (Open Data NY), prix moyens par région de l'État de New York :
  https://data.ny.gov/resource/rc94-5y2u.json (fioul) et https://data.ny.gov/resource/keug-6vc5.json (propane).

Règle : si une source ne répond pas ou renvoie un fichier illisible, le fichier précédent est gardé
(rien n'est écrit pour cette source) et le script le dit ; le site se reconstruit avec le dernier relevé.
Usage : python3 scripts/update-data.py [--dir <dossier du site>] [--cache <dossier de fichiers déjà téléchargés>]
Dépendance : xlrd (lecture des .xls de l'EIA), `pip install xlrd`.
"""
import json, os, sys, urllib.request, datetime, argparse, tempfile

AP = argparse.ArgumentParser()
AP.add_argument('--dir', default=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
AP.add_argument('--cache', default=None, help='dossier contenant déjà les .xls (tests hors ligne)')
ARGS = AP.parse_args()
OUT = os.path.join(ARGS.dir, 'src', 'data')
UA = {'User-Agent': 'Mozilla/5.0 (releve hebdomadaire; donnees publiques EIA)'}
SERIES = {'ho': 'EPD2F_PRS', 'pr': 'EPLLPA_PRS', 'hoW': 'EPD2F_PWR', 'prW': 'EPLLPA_PWR'}
SINCE = datetime.date(2013, 10, 1)  # 13 saisons : assez pour les comparaisons d'une saison à l'autre

def get(url, timeout=60):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()

def xls_path(key):
    name = f'PET_PRI_WFR_A_{SERIES[key]}_DPGAL_W.xls'
    if ARGS.cache:
        for cand in (name, name.lower(), f'{SERIES[key]}.xls'):
            p = os.path.join(ARGS.cache, cand)
            if os.path.exists(p):
                return p
    data = get(f'https://www.eia.gov/dnav/pet/xls/{name}')
    fd, p = tempfile.mkstemp(suffix='.xls')
    os.write(fd, data); os.close(fd)
    return p

def read_series(path):
    import xlrd
    book = xlrd.open_workbook(path)
    contents = book.sheet_by_index(0)
    meta = {}
    for r in range(contents.nrows):
        row = [str(c).strip() for c in contents.row_values(r)]
        if 'Release Date:' in row:
            meta['release'] = row[row.index('Release Date:') + 1]
        if 'Next Release Date:' in row:
            meta['next'] = row[row.index('Next Release Date:') + 1]
    sh = book.sheet_by_index(1)
    keys = sh.row_values(1)
    out = {}
    for c in range(1, sh.ncols):
        code = str(keys[c]).split('_')[3]  # W_EPD2F_PRS_SMA_DPG → SMA
        if code == 'NUS':
            area = 'US'
        elif code.startswith('S') and len(code) == 3:
            area = code[1:]
        else:
            area = code  # régions PADD (R10, R1X…)
        pts = []
        for r in range(3, sh.nrows):
            d, v = sh.cell_value(r, 0), sh.cell_value(r, c)
            if d == '' or v == '' or not isinstance(v, float):
                continue
            day = xlrd.xldate.xldate_as_datetime(d, book.datemode).date()
            if day < SINCE:
                continue
            pts.append([day.isoformat(), round(v, 3)])
        if pts:
            out[area] = pts
    return meta, out

def mdy_to_iso(s):
    m, d, y = s.split('/')
    y = int(y)
    return f'{y if y > 100 else 2000 + y:04d}-{int(m):02d}-{int(d):02d}'

def eia():
    data, meta = {}, {}
    for key in SERIES:
        p = xls_path(key)
        m, series = read_series(p)
        if not series.get('US'):
            raise RuntimeError(f'série {key} vide')
        data[key] = series
        meta.setdefault('release', m.get('release'))
        meta.setdefault('next', m.get('next'))
    last = max(pts[-1][0] for pts in data['ho'].values())
    return {
        'source': 'U.S. Energy Information Administration, State Heating Oil and Propane Program (weekly, excluding taxes)',
        'retrieved_at': datetime.date.today().isoformat(),
        'release_date': mdy_to_iso(meta['release']) if meta.get('release') else None,
        'next_release': mdy_to_iso(meta['next']) if meta.get('next') else None,
        'last_week': last,
        **data,
    }

NY_COMMON = {
    'statewide': 'new_york_statewide_average', 'longIsland': 'long_island_average_gal',
    'capital': 'capital_district_average', 'northCountry': 'north_country_average_gal',
    'central': 'central_new_york_average', 'western': 'western_new_york_average',
}
# Le jeu « fioul » sépare New York City et l'Hudson ; le jeu « propane » regroupe la vallée en « Mid-Hudson ».
NY_FIELDS = {
    'ho': {**NY_COMMON, 'nyc': 'new_york_city_average_gal', 'lowerHudson': 'lower_hudson_average_gal', 'upperHudson': 'upper_hudson_average_gal'},
    'pr': {**NY_COMMON, 'midHudson': 'mid_hudson_average_gal'},
}

def ny_dataset(ident, fields):
    rows = json.loads(get(f'https://data.ny.gov/resource/{ident}.json?$order=date%20DESC&$limit=800'))
    out = {}
    for row in rows:
        day = row.get('date', '')[:10]
        if not day or day < SINCE.isoformat():
            continue
        for k, f in fields.items():
            try:
                val = round(float(row[f]), 3)
            except (KeyError, TypeError, ValueError):
                continue
            out.setdefault(k, []).append([day, val])
    for k in out:
        out[k].sort()
    return out

def ny():
    ho = ny_dataset('rc94-5y2u', NY_FIELDS['ho'])
    pr = ny_dataset('keug-6vc5', NY_FIELDS['pr'])
    if not ho.get('statewide'):
        raise RuntimeError('NYSERDA vide')
    return {'source': 'NYSERDA, Average Home Heating Oil and Residential Propane Prices by Region (data.ny.gov)',
            'retrieved_at': datetime.date.today().isoformat(), 'ho': ho, 'pr': pr}

def write(name, obj):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name)
    old = None
    if os.path.exists(path):
        old = json.load(open(path))
    if old is not None:
        comparable = {k: v for k, v in obj.items() if k != 'retrieved_at'}
        if comparable == {k: v for k, v in old.items() if k != 'retrieved_at'}:
            print(f'{name} : rien de nouveau, fichier gardé')
            return
    with open(path, 'w') as f:
        json.dump(obj, f, separators=(',', ':'))
    print(f'{name} : écrit ({os.path.getsize(path)} octets)')

def season_of(day):
    """Saison de chauffe d'une semaine du relevé : octobre à mars ; « 2025-26 » pour oct. 2025 - mars 2026."""
    y, m = int(day[:4]), int(day[5:7])
    if m >= 10:
        return f'{y}-{str(y + 1)[2:]}'
    if m <= 3:
        return f'{y - 1}-{str(y)[2:]}'
    return None


def near(pts, target, tol=3):
    """Point de la série le plus proche d'une date (à tol jours près), sinon None."""
    t = datetime.date.fromisoformat(target)
    best = None
    for d, v in pts:
        gap = abs((datetime.date.fromisoformat(d) - t).days)
        if gap <= tol and (best is None or gap < best[0]):
            best = (gap, d, v)
    return [best[1], best[2]] if best else None


def area_summary(pts, whole=None):
    pts = [p for p in pts if season_of(p[0])]
    if not pts:
        return None
    last = pts[-1]
    cur = season_of(last[0])
    by = {}
    for d, v in pts:
        by.setdefault(season_of(d), []).append([d, v])
    seasons = []
    for s, sp in sorted(by.items()):
        y = int(s[:4])
        winter = [v for d, v in sp if d >= f'{y}-11-01']
        mid = near(sp, f'{y}-10-15', 4)
        seasons.append({
            's': s, 'oct': mid[1] if mid else None, 'octDate': mid[0] if mid else None,
            'avg': round(sum(winter) / len(winter), 3) if winter else None, 'weeks': len(winter),
            'max': max(sp, key=lambda p: p[1]), 'min': min(sp, key=lambda p: p[1]),
        })
    prev_season = next((x for x in reversed(seasons) if x['s'] != cur), None)
    y_ago = (datetime.date.fromisoformat(last[0]) - datetime.timedelta(days=364)).isoformat()
    out = {
        'last': last, 'prev': pts[-2] if len(pts) > 1 and season_of(pts[-2][0]) == cur else None,
        'yearAgo': near(pts, y_ago), 'season': cur, 'first': by[cur][0],
        'cur': by[cur], 'lastSeason': by.get(prev_season['s']) if prev_season else None,
        'seasons': seasons,
        'record': max(pts, key=lambda p: p[1]),
    }
    if whole:
        w = near(whole, last[0], 0)
        out['wholesale'] = w[1] if w else None
    return out


def summarize():
    """latest.json : ce que lisent les pages et les calculateurs (dernier prix, an passé, saisons)."""
    e = json.load(open(os.path.join(OUT, 'eia.json')))
    out = {'release_date': e['release_date'], 'next_release': e['next_release'], 'last_week': e['last_week'],
           'retrieved_at': e['retrieved_at'], 'ho': {}, 'pr': {}, 'ny': {}}
    for f, w in (('ho', 'hoW'), ('pr', 'prW')):
        for area, pts in e[f].items():
            if pts[-1][0] < e['last_week']:
                continue  # série arrêtée (DC pour le fioul depuis 2019) : plus publiée, pas affichée
            sm = area_summary(pts, e[w].get(area))
            if sm:
                out[f][area] = sm
    p = os.path.join(OUT, 'ny.json')
    if os.path.exists(p):
        n = json.load(open(p))
        out['ny_retrieved_at'] = n['retrieved_at']
        for f in ('ho', 'pr'):
            out['ny'][f] = {}
            for reg, pts in n[f].items():
                sm = area_summary(pts)
                if sm:
                    sm.pop('cur'); sm.pop('lastSeason')
                    out['ny'][f][reg] = sm
    # Les courbes de la saison (lues au build seulement) vont dans series.json ; latest.json reste léger
    # parce que les calculateurs du navigateur l'embarquent.
    series = {f: {a: {'cur': v.pop('cur'), 'lastSeason': v.pop('lastSeason')} for a, v in out[f].items()} for f in ('ho', 'pr')}
    with open(os.path.join(OUT, 'series.json'), 'w') as fh:
        json.dump(series, fh, separators=(',', ':'))
    with open(os.path.join(OUT, 'latest.json'), 'w') as fh:
        json.dump(out, fh, separators=(',', ':'))
    print(f"latest.json : semaine du {out['last_week']}, {len(out['ho'])} séries fioul, {len(out['pr'])} séries propane")


status = 0
for name, fn in (('eia.json', eia), ('ny.json', ny)):
    try:
        write(name, fn())
    except Exception as e:  # source muette : on garde le relevé précédent
        print(f'{name} : source injoignable ou illisible ({e}), relevé précédent gardé', file=sys.stderr)
        status = 1
summarize()  # toujours : à partir des fichiers présents (nouveaux ou gardés)
sys.exit(status)
