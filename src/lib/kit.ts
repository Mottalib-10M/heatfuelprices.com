/**
 * Writing kit (CONTRIBUTING-PAGES.md): every figure written in a page comes from here, never typed by hand.
 *   K.P                 params-2026.json (Btu, propane fill rule, LIHEAP rule, efficiencies, sources)
 *   K.L                 latest.json (EIA weekly prices summarized; K.L.last_week, K.L.release_date, K.L.ny)
 *   K.W                 winter.json (EIA Winter Fuels Outlook 2026-27, Table WF01)
 *   K.S(slug), K.SC(code)  one state of states.json (NOAA degree days, ACS heating fuel, LIHEAP 60 % SMI)
 *   K.sum(code, fuel)   weekly summary of a state, 'US' or a PADD code; K.price(code, fuel) this week's price
 *   K.ranked(fuel), K.place(code, fuel)  states from the dearest to the cheapest this week
 *   K.tool(kind, args)  runs a calculator of tool-specs.ts and returns its result card
 *   K.est(state, fuel, scen)  EIA average home's winter gallons scaled to the state's degree days
 *   formats             K.usd, K.ppg ($6.115), K.pct, K.num, K.dec, K.day (2026-10-19 -> October 19, 2026), K.gal
 */
import P from '../data/params-2026.json';
import { L, W, STATES, stateBySlug, stateByCode, sum, price, ranked, placeOf, FUEL_NAME, PADD_NAME, NY_REGIONS } from './data';
import { usd, ppg, pct, gal, getTool, longDate, estWinter, galPerHdd, priceFor, scenarioFactor } from './tool-specs';
import { formatNumber, formatDecimal } from './format';
import { replay, liheapLimit, perMBtu, volumeFromDensity } from './engine/fuel';
import type { V } from './tool-types';

function tool(kind: string, args: V = {}) {
  const spec = getTool(kind, args);
  const v: V = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]));
  return spec.run(v);
}
const lastDone = (code: string, f: 'ho' | 'pr') => sum(code, f)?.seasons.filter((x) => x.avg).at(-1) ?? null;
const liheap = (code: string, size: number) => {
  const st = STATES.find((x) => x.code === code)!;
  return liheapLimit({ size, fpgBase: P.liheap.fpgBase, fpgStep: P.liheap.fpgStep, fpgPct: P.liheap.fpgPct, sixty: st.smi.sixty, smi4: st.smi.smi4, smiPct: P.liheap.smiPct, factors: P.liheap.sizeFactors }).limit;
};
export const KIT = {
  /** 1st, 2nd, 3rd, 4th, 11th, 21st. */
  ord: (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`,
  /** Rank (1 = highest) of a state on a numeric field among the 38 surveyed states. */
  rankOf: (code: string, f: (s: (typeof STATES)[number]) => number) => [...STATES].sort((a, b) => f(b) - f(a)).findIndex((s) => s.code === code) + 1,
  /** Change on a year (ratio - 1) of this week's price; null when last year's week was not surveyed. */
  yoy: (code: string, f: 'ho' | 'pr') => { const x = sum(code, f); return x?.yearAgo ? x.last[1] / x.yearAgo[1] - 1 : null; },
  /** Change in dollars from the week before; null on the first week of a season. */
  wow: (code: string, f: 'ho' | 'pr') => { const x = sum(code, f); return x?.prev ? x.last[1] - x.prev[1] : null; },
  /** Word for a change: dir(x) -> 'up' | 'down' | 'unchanged' (custom words allowed). */
  dir: (x: number | null, up = 'up', down = 'down', flat = 'unchanged') => (x === null || Math.abs(x) < 0.0005 ? flat : x > 0 ? up : down),
  /** The last complete winter (November-March average) of a state and fuel. */
  lastDone,
  /** Dealer spread: this week's residential price minus the wholesale price of the same week (null if not published). */
  spread: (code: string, f: 'ho' | 'pr') => { const x = sum(code, f); return x?.wholesale ? x.last[1] - x.wholesale : null; },
  /** Federal LIHEAP income ceiling for a household size in a state. */
  liheap,

  P, L, W, STATES, S: stateBySlug, SC: stateByCode, sum, price, ranked, place: placeOf, tool, FUEL_NAME, PADD_NAME, NY_REGIONS,
  est: estWinter, galPerHdd, priceFor, scenarioFactor, replay, liheapLimit, perMBtu, volumeFromDensity,
  usd, ppg, pct, gal, num: (x: number) => formatNumber(x, 0), dec: (x: number, d = 1) => formatDecimal(x, d), day: longDate,
};
export type Kit = typeof KIT;
