#!/usr/bin/env python3
"""
Fiches d'État (src/data/states.json) et paramètres de l'hiver (src/data/winter.json), à partir des
fichiers officiels rangés dans data-src/ (relus une fois par an, pas chaque semaine) :

- data-src/noaa-cpc-hdd-states-1981-2010.txt
    NOAA Climate Prediction Center, degrés-jours de chauffage quotidiens normaux 1981-2010 par État,
    pondérés par la population (base 65 °F). Domaine public.
    https://ftp.cpc.ncep.noaa.gov/htdocs/degree_days/weighted/daily_data/climatology/1981-2010/StatesCONUS.Heating.txt
- data-src/acs-2024-b25040.json
    Census Bureau, American Community Survey 2024 (1 an), table B25040 « House heating fuel ».
    https://data.census.gov/api/access/data/table?id=ACSDT1Y2024.B25040&g=010XX00US$0400000
- data-src/acf-liheap-smi-fy2027-att4.txt
    HHS/ACF, LIHEAP IM 2026-01, Attachment 4 : 60 % du revenu médian de l'État par taille de foyer (FY2027),
    texte extrait du PDF https://acf.gov/sites/default/files/documents/ocs/COMM_LIHEAP_Att4SMITable_States_FY2027.pdf
- data-src/eia-wfo-2026-wf01.xlsx
    EIA, Winter Fuels Outlook (STEO d'octobre 2026), table WF01.
    https://www.eia.gov/outlooks/steo/report/perspectives/2026/10-winterfuels/wf01.xlsx

Usage : python3 scripts/build-states.py   (aucun accès réseau)
"""
import json, os, re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(ROOT, 'data-src')
OUT = os.path.join(ROOT, 'src', 'data')

# Les 38 États du relevé hebdomadaire de l'EIA (SHOPP). ho = fioul publié pour l'État.
# Région = région du Census Bureau (celle des tables de l'EIA) ; padd = district pétrolier.
STATES = [
    # code, nom, région, padd, fioul publié
    ('CT', 'Connecticut', 'Northeast', '1A', True), ('ME', 'Maine', 'Northeast', '1A', True),
    ('MA', 'Massachusetts', 'Northeast', '1A', True), ('NH', 'New Hampshire', 'Northeast', '1A', True),
    ('RI', 'Rhode Island', 'Northeast', '1A', True), ('VT', 'Vermont', 'Northeast', '1A', True),
    ('NJ', 'New Jersey', 'Northeast', '1B', True), ('NY', 'New York', 'Northeast', '1B', True),
    ('PA', 'Pennsylvania', 'Northeast', '1B', True), ('DE', 'Delaware', 'South', '1B', True),
    ('MD', 'Maryland', 'South', '1B', True), ('NC', 'North Carolina', 'South', '1C', True),
    ('VA', 'Virginia', 'South', '1C', True), ('IN', 'Indiana', 'Midwest', '2', True),
    ('IA', 'Iowa', 'Midwest', '2', True), ('KY', 'Kentucky', 'South', '2', True),
    ('MI', 'Michigan', 'Midwest', '2', True), ('MN', 'Minnesota', 'Midwest', '2', True),
    ('NE', 'Nebraska', 'Midwest', '2', True), ('OH', 'Ohio', 'Midwest', '2', True),
    ('WI', 'Wisconsin', 'Midwest', '2', True),
    ('IL', 'Illinois', 'Midwest', '2', False), ('KS', 'Kansas', 'Midwest', '2', False),
    ('MO', 'Missouri', 'Midwest', '2', False), ('ND', 'North Dakota', 'Midwest', '2', False),
    ('OK', 'Oklahoma', 'South', '2', False), ('SD', 'South Dakota', 'Midwest', '2', False),
    ('TN', 'Tennessee', 'South', '2', False), ('FL', 'Florida', 'South', '1C', False),
    ('GA', 'Georgia', 'South', '1C', False), ('AL', 'Alabama', 'South', '3', False),
    ('AR', 'Arkansas', 'South', '3', False), ('MS', 'Mississippi', 'South', '3', False),
    ('TX', 'Texas', 'South', '3', False), ('CO', 'Colorado', 'West', '4', False),
    ('ID', 'Idaho', 'West', '4', False), ('MT', 'Montana', 'West', '4', False),
    ('UT', 'Utah', 'West', '4', False),
]
# Plafond LIHEAP : 48 États contigus et DC (le seuil de pauvreté d'Alaska et d'Hawaï diffère).
LIHEAP_EXTRA = [
    ('DC', 'District of Columbia'), ('WV', 'West Virginia'), ('SC', 'South Carolina'), ('LA', 'Louisiana'),
    ('AZ', 'Arizona'), ('CA', 'California'), ('NV', 'Nevada'), ('NM', 'New Mexico'), ('OR', 'Oregon'),
    ('WA', 'Washington'), ('WY', 'Wyoming'),
]
slug = lambda n: n.lower().replace(' ', '-')
MONTHS = ['10', '11', '12', '01', '02', '03', '04']


def noaa():
    rows = open(os.path.join(SRC, 'noaa-cpc-hdd-states-1981-2010.txt')).read().splitlines()
    head = next(r for r in rows if r.startswith('Region|')).split('|')[1:]
    out = {}
    for r in rows:
        p = r.split('|')
        if len(p) != len(head) + 1 or p[0] == 'Region':
            continue
        days = {d: int(v) for d, v in zip(head, p[1:]) if d != '0229'}
        month = {m: sum(v for d, v in days.items() if d[:2] == m) for m in MONTHS}
        out[p[0]] = {
            'year': sum(days.values()),
            'winter': sum(month[m] for m in ['11', '12', '01', '02', '03']),
            'month': month,
        }
    return out


def acs():
    j = json.load(open(os.path.join(SRC, 'acs-2024-b25040.json')))
    data = j['response']['data']
    h = data[0]
    out = {}
    for r in data[1:]:
        d = dict(zip(h, r))
        tot = int(d['B25040_001E'])
        out[d['NAME']] = {'homes': tot, 'gas': int(d['B25040_002E']), 'propane': int(d['B25040_003E']), 'electric': int(d['B25040_004E']), 'oil': int(d['B25040_005E']), 'wood': int(d['B25040_007E'])}
    return out


def smi():
    txt = open(os.path.join(SRC, 'acf-liheap-smi-fy2027-att4.txt')).read()
    money = r'\$([\d,]+)'
    first, second = {}, {}
    part2 = txt.find('Size 7 through')
    for block, target in ((txt[:part2], first), (txt[part2:], second)):
        for m in re.finditer(r'^([A-Z][A-Za-z .]+?) ' + ' '.join([money] * 7) + r'\s*$', block, re.M):
            target[m.group(1).strip()] = [int(x.replace(',', '')) for x in m.groups()[1:]]
    out = {}
    for name, v in first.items():
        w = second.get(name)
        if not w or w[0] != v[0]:
            raise SystemExit(f'SMI : tableau incomplet pour {name}')
        out[name] = {'smi4': v[0], 'sixty': v[1:7] + w[1:3]}  # 1 à 8 personnes
    return out


def wfo():
    import openpyxl
    ws = openpyxl.load_workbook(os.path.join(SRC, 'eia-wfo-2026-wf01.xlsx'), data_only=True).worksheets[0]
    rows = [list(r) for r in ws.iter_rows(values_only=True)]
    title = next(str(r[0]) for r in rows if r[0] and 'Short-Term Energy Outlook' in str(r[0]))
    hdr = next(r for r in rows if r[0] == 'Fuel / Region')
    seasons = [str(x) for x in hdr[1:7]]
    col = {'base': 6, 'warmer': 8, 'colder': 10}
    fuel = region = None
    res = {'ho': {}, 'pr': {}, 'el': {}, 'hdd': {}, 'households': {}}
    section = None
    for r in rows:
        a = (str(r[0]).strip() if r[0] is not None else '')
        if a in ('Natural Gas', 'Heating Oil', 'Electricity', 'Propane') and section != 'hh' and all(x is None for x in r[1:]):
            fuel = {'Heating Oil': 'ho', 'Propane': 'pr', 'Electricity': 'el'}.get(a); section = 'fuel'; continue
        if a.startswith('Number of households'):
            section = 'hh'; continue
        if a == 'Heating degree days':
            section = 'hdd'; continue
        if section in ('fuel', 'hh') and all(x is None for x in r[1:]):
            region = {'U.S. Average': 'US', 'U.S.Totals': 'US'}.get(a, a); continue
        if section == 'fuel' and fuel:
            key = 'gal' if a.startswith('Consumption') else 'price' if a.startswith('Price') else 'spend' if a.startswith('Expenditures') else None
            if key:
                d = res[fuel].setdefault(region, {})
                d[key] = {k: round(float(r[c]), 3) for k, c in col.items()}
                d[key]['history'] = {s: round(float(x), 3) for s, x in zip(seasons, r[1:7])}
        if section == 'hh' and a in ('Heating oil', 'Propane'):
            res['households'].setdefault(region, {})['ho' if a == 'Heating oil' else 'pr'] = round(float(r[6]) * 1000)
        if section == 'hdd' and a:
            reg = {'U.S. Average': 'US'}.get(a, a)
            if reg in ('Northeast', 'Midwest', 'South', 'West', 'US'):
                res['hdd'][reg] = {k: round(float(r[c]), 1) for k, c in col.items()}
                res['hdd'][reg]['history'] = {s: round(float(x), 1) for s, x in zip(seasons, r[1:7])}
    res['release'] = title.split('|')[-1].strip()
    res['seasons'] = seasons
    return res


def main():
    hdd, homes, inc, w = noaa(), acs(), smi(), wfo()
    states = []
    for code, name, region, padd, ho in STATES:
        a = homes[name]
        states.append({
            'code': code, 'name': name, 'slug': slug(name), 'region': region, 'padd': padd,
            'ho': ho, 'pr': True,
            'hdd': hdd[code],
            'acs': {**a, 'oilShare': round(a['oil'] / a['homes'], 4), 'propaneShare': round(a['propane'] / a['homes'], 4)},
            'smi': inc[name],
        })
    extra = [{'code': c, 'name': n, 'smi': inc[n]} for c, n in LIHEAP_EXTRA]
    os.makedirs(OUT, exist_ok=True)
    json.dump(states, open(os.path.join(OUT, 'states.json'), 'w'), indent=1)
    json.dump(extra, open(os.path.join(OUT, 'liheap-other-states.json'), 'w'), indent=1)
    json.dump(w, open(os.path.join(OUT, 'winter.json'), 'w'), indent=1)
    print(f'states.json : {len(states)} États ; liheap-other-states.json : {len(extra)} ; winter.json : {w["release"]}')


main()
