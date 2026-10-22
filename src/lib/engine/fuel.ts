/**
 * Pure arithmetic of the calculators (tested in tests/engine.test.ts). No data import: every figure
 * comes in as an argument, so a test can feed a known case and the pages feed the week's prices.
 */

/** Gallons a delivery puts in a tank: up to `maxFill` of its size, minus what is already in it. */
export function fillGallons(o: { tank: number; gauge: number; maxFill: number }) {
  const room = o.tank * Math.max(0, o.maxFill - o.gauge);
  return Math.max(0, room);
}

/** Cost of a delivery: gallons × price per gallon, plus a sales tax rate and a flat fee if any. */
export function deliveryCost(o: { gallons: number; price: number; tax?: number; fee?: number }) {
  const fuel = o.gallons * o.price;
  const tax = fuel * (o.tax ?? 0);
  return { fuel, tax, fee: o.fee ?? 0, total: fuel + tax + (o.fee ?? 0) };
}

/** Propane: liquid share of a tank's volume allowed by a filling density by weight (29 CFR 1910.110, Table H-27). */
export const volumeFromDensity = (weightPct: number, specificGravity: number) => weightPct / specificGravity;

/**
 * Gallons a home uses over a winter (November to March), scaled from the EIA's average household of the
 * region to the state's normal heating degree days: gallonsPerHdd × stateWinterHdd × scenario.
 * `own`: the reader's own gallons last winter replace the estimate when above zero.
 */
export function winterGallons(o: { galPerHdd: number; hdd: number; scenario?: number; own?: number }) {
  if (o.own && o.own > 0) return o.own * (o.scenario ?? 1);
  return o.galPerHdd * o.hdd * (o.scenario ?? 1);
}

/** Months of a winter weighted by their normal degree days: the share of the season's fuel each month burns. */
export function monthlySplit(hddByMonth: Array<[string, number]>, gallons: number) {
  const total = hddByMonth.reduce((a, [, h]) => a + h, 0) || 1;
  return hddByMonth.map(([m, h]) => ({ m, share: h / total, gallons: (gallons * h) / total }));
}

/**
 * Days a tank lasts from a starting month: burns `galPerHdd` × each day's normal degree days (month total ÷
 * days in the month) until only `reserve` gallons are left. Returns days and the month it runs out in.
 */
export function daysLeft(o: { gallons: number; reserve: number; galPerHdd: number; months: Array<{ m: string; hdd: number; days: number }> }) {
  let left = Math.max(0, o.gallons - o.reserve);
  let days = 0;
  const burn: Array<{ m: string; used: number; end: number }> = [];
  for (let k = 0; k < 24 && left > 0; k++) {
    const mo = o.months[k % o.months.length];
    const perDay = (o.galPerHdd * mo.hdd) / mo.days;
    if (perDay <= 0) { days += mo.days; burn.push({ m: mo.m, used: 0, end: left }); continue; }
    const need = perDay * mo.days;
    if (need >= left) { days += left / perDay; burn.push({ m: mo.m, used: left, end: 0 }); left = 0; return { days: Math.floor(days), runsOutIn: mo.m, burn, lasts: false }; }
    left -= need; days += mo.days; burn.push({ m: mo.m, used: need, end: left });
  }
  return { days: Math.floor(days), runsOutIn: null as string | null, burn, lasts: true };
}

/**
 * Locking a price: what the fixed price saves (positive) or costs (negative) against paying `market`
 * per gallon for the same gallons, after a contract fee.
 */
export function lockGain(o: { fixed: number; market: number; gallons: number; fee?: number }) {
  return (o.market - o.fixed) * o.gallons - (o.fee ?? 0);
}

/** Price at which locking and waiting cost the same over a winter, fee included. */
export const breakEven = (o: { fixed: number; gallons: number; fee?: number }) => o.fixed + (o.gallons > 0 ? (o.fee ?? 0) / o.gallons : 0);

/**
 * Past winters replayed: for each season, the change from the mid-October price to the November-March
 * average, applied to today's price. Returns the winters where that average ended above the October price.
 */
export function replay(seasons: Array<{ s: string; oct: number | null; avg: number | null }>, today: number) {
  const rows = seasons.filter((x) => x.oct && x.avg).map((x) => ({ s: x.s, oct: x.oct!, avg: x.avg!, change: x.avg! / x.oct! - 1, implied: today * (x.avg! / x.oct!) }));
  const up = rows.filter((r) => r.change > 0).length;
  const sorted = [...rows].map((r) => r.change).sort((a, b) => a - b);
  const median = sorted.length ? (sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2) : 0;
  return { rows, up, n: rows.length, median };
}

/** Federal LIHEAP income ceiling: the greater of 150 % of the poverty guideline and 60 % of state median income. */
export function liheapLimit(o: { size: number; fpgBase: number; fpgStep: number; fpgPct: number; sixty: number[]; smi4: number; smiPct: number; factors: number[] }) {
  const n = Math.max(1, Math.round(o.size));
  const fpg = o.fpgBase + o.fpgStep * (n - 1);
  const byPoverty = Math.round(fpg * o.fpgPct);
  // Published table for 1 to 8 persons; above 8, 45 CFR 96.85 adds 3 points per person to the six-person factor.
  const bySmi = n <= o.sixty.length ? o.sixty[n - 1] : Math.round(o.smi4 * o.smiPct * (o.factors[5] + 0.03 * (n - 6)));
  return { fpg, byPoverty, bySmi, limit: Math.max(byPoverty, bySmi), rule: bySmi >= byPoverty ? 'smi' as const : 'poverty' as const };
}

/** Dollars per million Btu of heat delivered to the home: price ÷ (Btu per unit × efficiency) × 1,000,000. */
export const perMBtu = (o: { price: number; btu: number; efficiency: number }) => (o.efficiency > 0 ? (o.price / (o.btu * o.efficiency)) * 1e6 : 0);
