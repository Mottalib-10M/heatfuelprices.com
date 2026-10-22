/**
 * The calculators of the site, one entry per subject (declarative, rendered by components/calc/SpecTool.tsx
 * and MiniSim.tsx). Prices come from latest.json (EIA, every Wednesday), state facts from states.json, the
 * winter forecast from winter.json, fixed rules from params-2026.json. This file ships to the browser.
 */
import P from '../data/params-2026.json';
import { L, W, STATES, OTHER, sum, NY_REGIONS, type Fuel, type StateRow } from './data';
import type { ToolSpec, V, Input, ToolOut } from './tool-types';
import { formatMoney, formatPercent, formatNumber, displayDate } from './format';
import { fillGallons, deliveryCost, winterGallons, monthlySplit, daysLeft, lockGain, breakEven, replay, liheapLimit, perMBtu, volumeFromDensity } from './engine/fuel';

export const usd = (x: number) => `${x < -0.5 ? '-' : ''}${formatMoney(Math.abs(Math.round(x)), 0)}`;
/** Price per gallon as the EIA publishes it, to the tenth of a cent: $6.115. */
export const ppg = (x: number) => formatMoney(x, 3);
export const pct = (x: number, d = 1) => formatPercent(x, d);
export const gal = (x: number) => `${formatNumber(Math.round(x), 0)} gallons`;
export const longDate = (iso: string) => displayDate(iso, 'en-US');
const signed = (x: number, f: (y: number) => string) => (Math.abs(x) < 0.0005 ? 'unchanged' : `${x > 0 ? '+' : '-'}${f(Math.abs(x))}`);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k]);

const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthName = (m: string) => MONTH[Number(m) - 1];
const daysIn = (m: string) => [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][Number(m) - 1];
const WINTER = ['11', '12', '01', '02', '03'];
const SEASON = ['10', '11', '12', '01', '02', '03', '04'];

const ST = (code: string) => STATES.find((x) => x.code === code) ?? STATES.find((x) => x.code === 'MA')!;
const FUEL_LABEL: Record<Fuel, string> = { ho: 'Heating oil', pr: 'Propane' };
const fuelOf = (v: V): Fuel => (s(v, 'fuel') === 'pr' ? 'pr' : 'ho');
/** The state's price this week, or the U.S. average when the EIA does not publish that state for that fuel. */
export function priceFor(code: string, f: Fuel) {
  const own = sum(code, f);
  if (own) return { price: own.last[1], week: own.last[0], area: ST(code).name, own: true, sum: own };
  const us = sum('US', f)!;
  return { price: us.last[1], week: us.last[0], area: 'U.S. average', own: false, sum: us };
}
/** EIA average household of the state's region: gallons per heating degree day over November-March. */
export function galPerHdd(st: StateRow, f: Fuel) {
  if (f === 'ho') return W.ho.US.gal.base / W.hdd.Northeast.base; // 82 % of oil-heated homes are in the Northeast (WF01)
  const r = W.pr[st.region] ? st.region : 'US';
  return W.pr[r].gal.base / W.hdd[r].base;
}
export function scenarioFactor(st: StateRow, f: Fuel, scen: string) {
  if (scen !== 'warmer' && scen !== 'colder') return 1;
  const g = f === 'ho' ? W.ho.US.gal : (W.pr[st.region] ?? W.pr.US).gal;
  return g[scen] / g.base;
}
export const estWinter = (st: StateRow, f: Fuel, scen = 'base') => winterGallons({ galPerHdd: galPerHdd(st, f), hdd: st.hdd.winter, scenario: scenarioFactor(st, f, scen) });

const STATE_OPTIONS = STATES.map((x) => ({ value: x.code, label: x.name })).sort((a, b) => a.label.localeCompare(b.label));
const stateIn = (def = 'MA'): Input => ({ kind: 'select', id: 'st', label: 'State', def, options: STATE_OPTIONS });
const fuelIn = (def: Fuel = 'ho'): Input => ({ kind: 'choice', id: 'fuel', label: 'Fuel', def, options: [{ value: 'ho', label: 'Heating oil' }, { value: 'pr', label: 'Propane' }] });
const myPriceIn: Input = { id: 'my', label: "Your dealer's price per gallon", def: 0, unit: '$/gal', max: 20, decimals: 3, help: "Empty: this week's state average", adv: true };
const taxIn: Input = { id: 'tax', label: 'Sales tax on heating fuel', def: 0, unit: '%', max: 15, decimals: 2, help: 'EIA prices exclude taxes; add your state rate if one applies', adv: true };
const weekNote = (week: string) => `EIA weekly survey of ${longDate(week)}, excluding taxes. Next release ${longDate(L.next_release)}.`;
const usedPrice = (v: V, st: StateRow, f: Fuel) => {
  const p = priceFor(st.code, f);
  const my = n(v, 'my');
  return my > 0 ? { ...p, price: my, label: 'Your price' } : { ...p, label: p.own ? `${p.area} average, ${longDate(p.week)}` : `U.S. average (${st.name} not surveyed for ${FUEL_LABEL[f].toLowerCase()})` };
};

function priceCard(v: V): ToolOut {
  const f = fuelOf(v), st = ST(s(v, 'st'));
  const p = priceFor(st.code, f);
  const x = p.sum;
  const order = n(v, 'gal');
  const rows: ToolOut['rows'] = [
    [`${formatNumber(order, 0)} gallons at this price`, usd(order * p.price)],
    ['Change from the week before', x.prev ? signed(p.price - x.prev[1], ppg) : 'first week of the season'],
    ['Same week a year ago', x.yearAgo ? `${ppg(x.yearAgo[1])} (${signed(p.price / x.yearAgo[1] - 1, (y) => pct(y))})` : 'not surveyed'],
  ];
  const lastSeason = x.seasons.filter((y) => y.s !== x.season && y.avg).at(-1);
  if (lastSeason) rows.push([`Average of last winter (${lastSeason.s}, November to March)`, ppg(lastSeason.avg!)]);
  if (x.wholesale) rows.push(['Wholesale price the same week', `${ppg(x.wholesale)} (dealer spread ${ppg(p.price - x.wholesale)})`]);
  if (p.own) rows.push(['U.S. average', ppg(sum('US', f)!.last[1])]);
  return {
    label: `${FUEL_LABEL[f]}, ${p.area}, week of ${longDate(p.week)}`,
    value: `${ppg(p.price)}/gal`,
    sub: p.own ? undefined : `The EIA does not survey ${FUEL_LABEL[f].toLowerCase()} in ${st.name}: U.S. average shown.`,
    rows,
    note: weekNote(p.week),
  };
}

function fillCard(v: V): ToolOut {
  const f = fuelOf(v), st = ST(s(v, 'st'));
  const p = usedPrice(v, st, f);
  const g = fillGallons({ tank: n(v, 'tank'), gauge: n(v, 'gauge') / 100, maxFill: n(v, 'fill') / 100 });
  const c = deliveryCost({ gallons: g, price: p.price, tax: n(v, 'tax') / 100 });
  const ya = p.sum.yearAgo;
  const rows: ToolOut['rows'] = [
    ['Gallons the delivery adds', gal(g)],
    [p.label, `${ppg(p.price)}/gal`],
  ];
  if (c.tax > 0) rows.push(['Sales tax', usd(c.tax)]);
  if (ya && n(v, 'my') === 0) rows.push([`Same fill at last year's price (${ppg(ya[1])})`, usd(g * ya[1])]);
  rows.push(['Full tank from empty, same price', usd(deliveryCost({ gallons: n(v, 'tank') * (n(v, 'fill') / 100), price: p.price, tax: n(v, 'tax') / 100 }).total)]);
  const lo = volumeFromDensity(P.propaneFill.weightPct, P.propaneFill.sgHigh), hi = volumeFromDensity(P.propaneFill.weightPct, P.propaneFill.sgLow);
  return {
    label: `Cost to fill your ${FUEL_LABEL[f].toLowerCase()} tank`,
    value: usd(c.total),
    sub: g === 0 ? 'The gauge is already at or above the fill level you set.' : undefined,
    rows,
    note: f === 'pr'
      ? `Propane tanks are never filled to the top: federal rules cap a home tank at ${pct(lo)} to ${pct(hi)} of its volume (29 CFR 1910.110, Table H-27). ${weekNote(p.week)}`
      : `A delivery stops a little short of the brim, so the real bill is at most this. ${weekNote(p.week)}`,
  };
}

function budgetCard(v: V): ToolOut {
  const f = fuelOf(v), st = ST(s(v, 'st'));
  const scen = s(v, 'scen');
  const p = usedPrice(v, st, f);
  const g = winterGallons({ galPerHdd: galPerHdd(st, f), hdd: st.hdd.winter, scenario: scenarioFactor(st, f, scen), own: n(v, 'own') });
  const c = deliveryCost({ gallons: g, price: p.price, tax: n(v, 'tax') / 100 });
  const split = monthlySplit(WINTER.map((m) => [m, st.hdd.month[m]]), g);
  const fc = f === 'ho' ? W.ho.US.price.base : (W.pr[st.region] ?? W.pr.US).price.base;
  return {
    label: `${FUEL_LABEL[f]} for the winter in ${st.name}, November to March`,
    value: usd(c.total),
    sub: `${gal(g)} at ${ppg(p.price)}/gal${n(v, 'own') > 0 ? ' (your own gallons)' : ` (EIA average home, scaled to ${st.name}'s degree days)`}.`,
    rows: [
      ...split.map((x) => [`${monthName(x.m)}: ${gal(x.gallons)}`, usd(x.gallons * p.price * (1 + n(v, 'tax') / 100)), x.gallons] as [string, string, number]),
      [`At the EIA forecast winter price (${ppg(fc)}, ${f === 'ho' ? 'U.S.' : (W.pr[st.region] ? st.region : 'U.S.')})`, usd(g * fc)],
    ],
    note: `Gallons follow ${st.name}'s normal heating degree days (NOAA, 1981-2010). ${scen === 'base' ? 'Normal winter.' : `EIA ${scen} winter scenario.`} ${weekNote(p.week)}`,
  };
}

function lockCard(v: V): ToolOut {
  const f = fuelOf(v), st = ST(s(v, 'st'));
  const p = priceFor(st.code, f);
  const fixed = n(v, 'fixed') || p.price;
  const g = n(v, 'gal');
  const fee = n(v, 'fee');
  const now = lockGain({ fixed, market: p.price, gallons: g, fee });
  const r = replay(p.sum.seasons.filter((x) => x.s !== p.sum.season), p.price);
  const be = breakEven({ fixed, gallons: g, fee });
  const better = r.rows.filter((x) => x.implied > be).length;
  return {
    label: `Locking ${gal(g)} of ${FUEL_LABEL[f].toLowerCase()} at ${ppg(fixed)}`,
    value: `${now >= 0 ? 'Saves' : 'Costs'} ${usd(Math.abs(now))}`,
    sub: `against paying this week's ${p.area} average (${ppg(p.price)}) all winter. The lock pays off when the winter averages above ${ppg(be)}.`,
    rows: [
      ['Break-even winter price', ppg(be)],
      [`Past winters where the November-March average beat the mid-October price`, `${r.up} of ${r.n}`],
      ['Median change, mid-October to winter average', signed(r.median, (y) => pct(y))],
      [`Past winters, replayed from today's price, that end above ${ppg(be)}`, `${better} of ${r.n}`],
    ],
    table: {
      caption: `Each past winter in ${p.area}, its mid-October price and its November-March average, and that change applied to today's ${ppg(p.price)}.`,
      headers: ['Winter', 'Mid-October', 'Nov-Mar average', 'Change', 'Today replayed', 'Lock vs. wait'],
      rows: r.rows.slice().reverse().map((x) => [x.s, ppg(x.oct), ppg(x.avg), signed(x.change, (y) => pct(y)), ppg(x.implied), signed(lockGain({ fixed, market: x.implied, gallons: g, fee }), usd)]),
      align: ['l', 'r', 'r', 'r', 'r', 'r'],
    },
    note: `History is not a forecast: it shows how often a price set in October has turned out cheap. ${weekNote(p.week)}`,
  };
}

function daysCard(v: V): ToolOut {
  const f = fuelOf(v), st = ST(s(v, 'st'));
  const own = n(v, 'own');
  const rate = own > 0 ? own / st.hdd.winter : galPerHdd(st, f);
  const start = s(v, 'from');
  const i = SEASON.indexOf(start);
  const months = [...SEASON.slice(i < 0 ? 1 : i), ...SEASON.slice(0, i < 0 ? 1 : i)].map((m) => ({ m, hdd: st.hdd.month[m] ?? 0, days: daysIn(m) }));
  const d = daysLeft({ gallons: n(v, 'now'), reserve: n(v, 'reserve'), galPerHdd: rate, months });
  return {
    label: `Days your ${FUEL_LABEL[f].toLowerCase()} lasts in ${st.name} from early ${monthName(start)}`,
    value: d.lasts ? 'Through April' : `${formatNumber(d.days, 0)} days`,
    sub: d.lasts ? 'At normal temperatures the tank covers the rest of the season above your reserve.' : `In a normal winter you reach your reserve in ${monthName(d.runsOutIn!)}.`,
    rows: d.burn.slice(0, 7).map((x) => [`${monthName(x.m)}: ${gal(x.used)} burned`, x.end > 0 ? `${gal(x.end)} left` : 'reserve reached', x.used] as [string, string, number]),
    note: `Burn rate: ${formatNumber(rate, 3)} gallons per heating degree day (${own > 0 ? 'your own winter' : 'EIA average home'}), spread over ${st.name}'s normal days (NOAA, 1981-2010). A cold snap burns faster.`,
  };
}

const LIHEAP_OPTIONS = [...STATES.map((x) => ({ code: x.code, name: x.name, smi: x.smi })), ...OTHER].sort((a, b) => a.name.localeCompare(b.name));
function liheapCard(v: V): ToolOut {
  const st = LIHEAP_OPTIONS.find((x) => x.code === s(v, 'st')) ?? LIHEAP_OPTIONS[0];
  const size = Math.min(12, Math.max(1, Math.round(n(v, 'size'))));
  const r = liheapLimit({ size, fpgBase: P.liheap.fpgBase, fpgStep: P.liheap.fpgStep, fpgPct: P.liheap.fpgPct, sixty: st.smi.sixty, smi4: st.smi.smi4, smiPct: P.liheap.smiPct, factors: P.liheap.sizeFactors });
  const inc = n(v, 'income');
  const floor = Math.round(r.fpg * P.liheap.floorPct);
  const verdict = inc <= 0 ? undefined : inc <= r.limit ? `${usd(inc)} is under the federal ceiling by ${usd(r.limit - inc)}: ${st.name} may serve your household, if its own limit is not lower.` : `${usd(inc)} is above the federal ceiling by ${usd(inc - r.limit)}: no state may use a higher limit.`;
  return {
    label: `Federal LIHEAP income ceiling, ${st.name}, household of ${size}`,
    value: `${usd(r.limit)} a year`,
    sub: verdict,
    rows: [
      ['60 % of state median income (FY2027)', usd(r.bySmi)],
      ['150 % of the 2026 poverty guideline', usd(r.byPoverty)],
      ['Monthly equivalent of the ceiling', usd(r.limit / 12)],
      ['Floor: no state may refuse on income below', usd(floor)],
    ],
    note: `The greater of the two lines (42 U.S.C. 8624(b)(2)(B)). Each state sets its own limit between ${usd(floor)} and ${usd(r.limit)} for this size and checks it with its agency.`,
  };
}

function compareCard(v: V): ToolOut {
  const st = ST(s(v, 'st'));
  const oil = n(v, 'po') || priceFor(st.code, 'ho').price;
  const pro = n(v, 'pp') || priceFor(st.code, 'pr').price;
  const el = (n(v, 'pe') || (W.el[st.region] ?? W.el.US).price.base) / 100;
  const items = [
    { k: 'Heating oil', c: perMBtu({ price: oil, btu: P.btu.oil, efficiency: n(v, 'eo') / 100 }), u: `${ppg(oil)}/gal at ${n(v, 'eo')} % AFUE` },
    { k: 'Propane', c: perMBtu({ price: pro, btu: P.btu.propane, efficiency: n(v, 'ep') / 100 }), u: `${ppg(pro)}/gal at ${n(v, 'ep')} % AFUE` },
    { k: 'Electric resistance', c: perMBtu({ price: el, btu: P.btu.kwh, efficiency: 1 }), u: `${formatNumber(el * 100, 1)} cents/kWh` },
  ].sort((a, b) => a.c - b.c);
  const need = estWinter(st, 'ho') * P.btu.oil * 0.87 / 1e6;
  return {
    label: `Cost of one million Btu of heat in ${st.name}`,
    value: `${items[0].k}, ${formatMoney(items[0].c, 2)}`,
    sub: `${items[1].k} costs ${pct(items[1].c / items[0].c - 1, 0)} more per unit of heat delivered.`,
    rows: [
      ...items.map((x) => [`${x.k} (${x.u})`, `${formatMoney(x.c, 2)} per million Btu`, x.c] as [string, string, number]),
      ...items.map((x) => [`${x.k}: a winter's heat (${formatNumber(need, 0)} million Btu)`, usd(x.c * need)] as [string, string]),
    ],
    note: `Btu per gallon and per kWh: EIA. Default prices: this week's EIA survey (excluding taxes) and the EIA's ${(W.el[st.region] ? st.region : 'U.S.')} winter electricity forecast. Winter heat: the EIA average oil-heated home scaled to ${st.name}'s degree days.`,
  };
}

const NY_HO = Object.keys(L.ny.ho ?? {}), NY_PR = Object.keys(L.ny.pr ?? {});
function nyCard(v: V): ToolOut {
  const f = fuelOf(v);
  const pool = f === 'ho' ? L.ny.ho : L.ny.pr;
  const keys = f === 'ho' ? NY_HO : NY_PR;
  const reg = keys.includes(s(v, 'reg')) ? s(v, 'reg') : keys.includes('longIsland') ? 'longIsland' : keys[0];
  const x = pool[reg];
  const order = n(v, 'gal');
  const all = keys.map((k) => ({ k, p: pool[k].last[1] })).sort((a, b) => b.p - a.p);
  return {
    label: `${FUEL_LABEL[f]}, ${NY_REGIONS[reg] ?? reg}, NYSERDA survey of ${longDate(x.last[0])}`,
    value: `${ppg(x.last[1])}/gal`,
    sub: reg !== s(v, 'reg') && f === 'pr' && s(v, 'reg') ? 'NYSERDA groups the Hudson Valley differently for propane: nearest region shown.' : undefined,
    rows: [
      [`${formatNumber(order, 0)} gallons at this price`, usd(order * x.last[1])],
      ['Change from the survey before', x.prev ? signed(x.last[1] - x.prev[1], ppg) : 'first survey of the season'],
      ['Same week a year ago', x.yearAgo ? ppg(x.yearAgo[1]) : 'not surveyed'],
      ['Rank among New York regions', `${all.findIndex((y) => y.k === reg) + 1} of ${all.length} (1 = dearest)`],
    ],
    note: 'NYSERDA, average residential prices by region, published on data.ny.gov. EIA figures for New York State can differ by a few cents: the two surveys sample different dealers.',
  };
}

function historyCard(v: V): ToolOut {
  const f = fuelOf(v), st = ST(s(v, 'st'));
  const p = priceFor(st.code, f);
  const done = p.sum.seasons.filter((x) => x.avg);
  const cheapest = [...done].sort((a, b) => a.avg! - b.avg!)[0];
  const dearest = [...done].sort((a, b) => b.avg! - a.avg!)[0];
  return {
    label: `${FUEL_LABEL[f]} in ${p.area}: every winter since ${done[0]?.s ?? ''}`,
    value: `${ppg(p.price)}/gal now`,
    sub: `Highest weekly price since October ${p.sum.seasons[0].s.slice(0, 4)}: ${ppg(p.sum.record[1])} (${longDate(p.sum.record[0])}).`,
    rows: [
      [`Cheapest winter (${cheapest.s})`, ppg(cheapest.avg!)],
      [`Dearest winter (${dearest.s})`, ppg(dearest.avg!)],
      ['This week against the dearest winter average', signed(p.price / dearest.avg! - 1, (y) => pct(y))],
    ],
    table: {
      caption: `November-March average, mid-October price and the season's high and low, EIA weekly survey, ${p.area}.`,
      headers: ['Winter', 'Mid-October', 'Nov-Mar average', 'Season high', 'Season low'],
      rows: p.sum.seasons.slice().reverse().map((x) => [x.s, x.oct ? ppg(x.oct) : 'n/a', x.avg ? ppg(x.avg) : 'in progress', ppg(x.max[1]), ppg(x.min[1])]),
      align: ['l', 'r', 'r', 'r', 'r'],
    },
    note: weekNote(p.week),
  };
}

function forecastCard(v: V): ToolOut {
  const f = fuelOf(v);
  const reg = s(v, 'reg');
  const t = f === 'ho' ? W.ho.US : (W.pr[reg] ?? W.pr.US);
  const area = f === 'ho' ? 'U.S. average' : W.pr[reg] ? reg : 'U.S. average';
  const now = sum(f === 'ho' ? 'US' : ({ Northeast: 'R1X', Midwest: 'R20', South: 'R30' } as Record<string, string>)[reg] ?? 'US', f) ?? sum('US', f)!;
  const prev = t.price.history[W.seasons[W.seasons.length - 2]];
  return {
    label: `EIA forecast for ${FUEL_LABEL[f].toLowerCase()}, winter ${W.seasons.at(-1)}, ${area}`,
    value: `${ppg(t.price.base)}/gal`,
    sub: `Average residential price forecast for November to March, against ${ppg(prev)} last winter (${signed(t.price.base / prev - 1, (y) => pct(y))}).`,
    rows: [
      ['Gallons an average home burns (normal winter)', gal(t.gal.base)],
      ['Winter bill, normal forecast', usd(t.spend.base)],
      ['Winter bill, warmer scenario', usd(t.spend.warmer)],
      ['Winter bill, colder scenario', usd(t.spend.colder)],
      ['Latest weekly survey price for comparison', `${ppg(now.last[1])} (${longDate(now.last[0])})`],
    ],
    note: `EIA, Short-Term Energy Outlook of October 2026, Table WF01. A forecast, revised each month; ${f === 'ho' ? 'heating oil is forecast for the U.S. only' : 'no propane forecast is published for the West'}.`,
  };
}

const scenIn: Input = { kind: 'choice', id: 'scen', label: 'Winter', def: 'base', options: [{ value: 'warmer', label: 'Warmer' }, { value: 'base', label: 'Normal' }, { value: 'colder', label: 'Colder' }] };
const startIn: Input = { kind: 'select', id: 'from', label: 'Starting in early', def: '11', options: SEASON.map((m) => ({ value: m, label: monthName(m) })) };

export const SPECS: Record<string, (arg?: Record<string, number | string>) => ToolSpec> = {
  price: (a) => ({
    inputs: [stateIn(String(a?.st ?? 'MA')), fuelIn((a?.fuel as Fuel) ?? 'ho'), { id: 'gal', label: 'Gallons you order', def: Number(a?.gal ?? 150), unit: 'gal', max: 2000 }],
    run: priceCard,
  }),
  fill: (a) => {
    const f = (a?.fuel as Fuel) ?? 'ho';
    return {
      inputs: [
        stateIn(String(a?.st ?? 'MA')), fuelIn(f),
        { id: 'tank', label: 'Tank size', def: Number(a?.tank ?? (f === 'pr' ? 500 : 275)), unit: 'gal', max: 5000, help: 'The capacity printed on the tank label' },
        { id: 'gauge', label: 'Gauge reading now', def: Number(a?.gauge ?? (f === 'pr' ? 30 : 25)), unit: '%', max: 100, help: 'Propane gauges read in percent; 1/4 on an oil gauge = 25' },
        { id: 'fill', label: 'Filled up to', def: Number(a?.fill ?? (f === 'pr' ? P.propaneFill.defaultPct * 100 : 100)), unit: '%', max: 100, help: f === 'pr' ? 'Propane: 80 % is a safe level under the federal cap' : 'Oil: 100 % gives the most it can cost' },
        myPriceIn, taxIn,
      ],
      run: fillCard,
    };
  },
  budget: (a) => ({
    inputs: [stateIn(String(a?.st ?? 'MA')), fuelIn((a?.fuel as Fuel) ?? 'ho'), scenIn, { id: 'own', label: 'Gallons you used last winter', def: Number(a?.own ?? 0), unit: 'gal', max: 5000, help: 'Empty: the EIA average home of your region' }, myPriceIn, taxIn],
    run: budgetCard,
  }),
  lockin: (a) => {
    const st = ST(String(a?.st ?? 'MA')), f = (a?.fuel as Fuel) ?? 'ho';
    return {
      inputs: [
        stateIn(st.code), fuelIn(f),
        { id: 'fixed', label: 'Price the dealer offers', def: Number(a?.fixed ?? 0), unit: '$/gal', max: 20, decimals: 3, help: "Empty: this week's state average" },
        { id: 'gal', label: 'Gallons you commit to', def: Number(a?.gal ?? Math.round(estWinter(st, f) / 50) * 50), unit: 'gal', max: 5000 },
        { id: 'fee', label: 'Contract or price-cap fee', def: Number(a?.fee ?? 0), unit: '$', max: 2000, adv: true },
      ],
      run: lockCard,
    };
  },
  days: (a) => ({
    inputs: [stateIn(String(a?.st ?? 'MA')), fuelIn((a?.fuel as Fuel) ?? 'ho'), { id: 'now', label: 'Gallons in the tank now', def: Number(a?.now ?? 150), unit: 'gal', max: 5000 }, startIn,
      { id: 'reserve', label: 'Reorder when down to', def: Number(a?.reserve ?? 0), unit: 'gal', max: 2000, help: 'Empty: count until the tank is dry' },
      { id: 'own', label: 'Gallons you used last winter', def: 0, unit: 'gal', max: 5000, adv: true, help: 'Empty: the EIA average home of your region' }],
    run: daysCard,
  }),
  liheap: (a) => ({
    inputs: [{ kind: 'select', id: 'st', label: 'State', def: String(a?.st ?? 'PA'), options: LIHEAP_OPTIONS.map((x) => ({ value: x.code, label: x.name })) },
      { id: 'size', label: 'People in the household', def: Number(a?.size ?? 3), max: 12 },
      { id: 'income', label: 'Household income a year', def: Number(a?.income ?? 0), unit: '$', max: 1000000, help: 'As your state counts it; empty: ceiling only' }],
    run: liheapCard,
  }),
  compare: (a) => ({
    inputs: [stateIn(String(a?.st ?? 'PA')),
      { id: 'eo', label: 'Oil boiler or furnace AFUE', def: P.efficiency.oil * 100, unit: '%', max: 100, help: 'ENERGY STAR minimum shown; see your unit label' },
      { id: 'ep', label: 'Propane boiler or furnace AFUE', def: P.efficiency.propane * 100, unit: '%', max: 100 },
      { id: 'po', label: 'Oil price', def: 0, unit: '$/gal', max: 20, decimals: 3, adv: true, help: "Empty: this week's state average" },
      { id: 'pp', label: 'Propane price', def: 0, unit: '$/gal', max: 20, decimals: 3, adv: true, help: "Empty: this week's state average" },
      { id: 'pe', label: 'Electricity price', def: 0, unit: '¢/kWh', max: 100, decimals: 1, adv: true, help: 'Empty: EIA winter forecast for your region' }],
    run: compareCard,
  }),
  ny: (a) => ({
    inputs: [fuelIn((a?.fuel as Fuel) ?? 'ho'), { kind: 'select', id: 'reg', label: 'Region of New York', def: String(a?.reg ?? 'longIsland'), options: NY_HO.map((k) => ({ value: k, label: NY_REGIONS[k] ?? k })) }, { id: 'gal', label: 'Gallons you order', def: 150, unit: 'gal', max: 2000 }],
    run: nyCard,
  }),
  history: (a) => ({ inputs: [stateIn(String(a?.st ?? 'MA')), fuelIn((a?.fuel as Fuel) ?? 'ho')], run: historyCard }),
  forecast: (a) => ({
    inputs: [fuelIn((a?.fuel as Fuel) ?? 'ho'), { kind: 'select', id: 'reg', label: 'Region (propane)', def: String(a?.reg ?? 'Northeast'), options: ['Northeast', 'Midwest', 'South', 'US'].map((r) => ({ value: r, label: r === 'US' ? 'U.S. average' : r })) }],
    run: forecastCard,
  }),
};
export const TOOL_KINDS = Object.keys(SPECS);
export function getTool(kind: string, arg?: Record<string, number | string>): ToolSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown tool ${kind}`);
  const spec = f(arg);
  if (!arg) return spec;
  return { ...spec, inputs: spec.inputs.map((i) => (i.id in arg ? { ...i, def: arg[i.id] } as Input : i)) };
}
