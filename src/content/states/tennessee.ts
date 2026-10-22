import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('TN');
const p = K.sum('TN', 'pr')!;
const pld = K.lastDone('TN', 'pr')!;
const galP = K.est(st, 'pr');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'tennessee',
  title: 'Tennessee Propane Prices This Week, Winter 2026-27 Survey',
  description: `Tennessee propane prices from the federal weekly survey, winter 2026-27: price per gallon, the dealer's margin, what a fill costs and a mild winter's bill.`,
  intro: `Tennessee propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Tennessee is an electric-heat state: ${K.pct(st.acs.electric / st.acs.homes, 0)} of its homes heat with electricity, by the Census Bureau's 2024 count. Propane is the main fuel of ${K.num(st.acs.propane)} homes, ${K.pct(st.acs.propaneShare, 1)} of the total, and for those households the weekly federal survey is the reference price. In the EIA's weekly survey of ${K.day(p.last[0])}, Tennessee propane averaged ${K.ppg(p.last[1])} a gallon, ${K.ord(K.place('TN', 'pr'))} of ${K.ranked('pr').length} states counting from the dearest, ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the national average. Last winter the state averaged ${K.ppg(pld.avg!)} from November to March. The winter is mild, ${K.num(st.hdd.winter)} heating degree days over those months, so the EIA's average propane home in the South would burn about ${K.gal(galP)}, ${K.usd(galP * p.last[1])} at this week's average. Heating oil is not surveyed in Tennessee. Prices exclude taxes and fees.`,
  body: (h) => `
<h2>Where the Tennessee price comes from</h2>
<p>The EIA's wholesale propane price for Tennessee this week is ${p.wholesale ? K.ppg(p.wholesale) : 'unpublished'}. ${K.spread('TN', 'pr') === null ? 'Without it the margin cannot be computed.' : `Against the residential average, that leaves ${K.ppg(K.spread('TN', 'pr')!)} a gallon, ${K.pct(K.spread('TN', 'pr')! / p.last[1], 0)} of the price, for delivery, storage, the tank and the dealer.`}${K.spread('TN', 'pr') === null ? '' : ` For comparison, the EIA's Midwest wholesale price this week is ${K.sum('R20', 'pr')?.wholesale ? K.ppg(K.sum('R20', 'pr')!.wholesale!) : 'unpublished'}.`}</p>
${h.mini('price', { t: 'Tennessee propane and your order', p: ['gal'], d: { st: 'TN', fuel: 'pr', gal: 250 }, c: 'Open the price lookup' })}
<h2>Seasons in Tennessee</h2>
<p>Last winter the Tennessee average ran from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}, its dearest week on ${K.day(pld.max[0])}. The highest week the survey has recorded in the state is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}. Since ${p.seasons[0].s}, the November to March average finished above the mid-October price in ${rp.up} of ${rp.n} winters, with a median change of ${K.pct(rp.median, 1)}. The ${h.a('lock-in-or-wait', 'lock-in check')} replays those winters against a dealer's fixed price.</p>
<h2>Tennessee and its neighbors</h2>
<p>This week Tennessee propane is ${gap('KY')} than Kentucky's average, ${gap('GA')} than Georgia's, ${gap('AL')} than Alabama's and ${gap('NC')} than North Carolina's. A 500-gallon tank filled from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at the Tennessee average, against ${K.usd(250 * K.price('US', 'pr')!)} at the national one.</p>
<h2>A mild winter, a modest tank</h2>
<p>NOAA's normals give Tennessee ${K.num(st.hdd.month['12'])} heating degree days in December and ${K.num(st.hdd.month['01'])} in January, weighted by population. A propane home may also use the tank for cooking, hot water or a fireplace, which adds gallons all year; the winter estimate counts heating only. The ${h.a('winter-heating-budget', 'winter budget')} takes the gallons you actually bought, and the ${h.a('propane-tank-fill-cost', 'propane tank calculator')} checks a bill against the gauge. Per million Btu at the ENERGY STAR furnace rating, Tennessee propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week; the ${h.a('heating-oil-vs-propane', 'comparison page')} sets it against electricity, the most common heating fuel in the state. The federal LIHEAP ceiling for three people in Tennessee is ${K.usd(K.liheap('TN', 3))} a year.</p>
`,
  faqs: [
    { q: 'What does propane cost in Tennessee this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} for the United States. Filling a 500-gallon tank from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at that average. Your dealer's price may differ.` },
    { q: 'How much of the Tennessee propane price is the dealer margin?', a: `The EIA's wholesale price for Tennessee this week is ${p.wholesale ? K.ppg(p.wholesale) : 'unpublished'}, against a residential average of ${K.ppg(p.last[1])}. The gap is the dealer margin, ${K.spread('TN', 'pr') === null ? 'which the survey does not measure this week' : `${K.ppg(K.spread('TN', 'pr')!)} a gallon here`}, which covers delivery, storage, the tank and profit. It is the part of the bill that the wholesale market does not set, and dealers' margins differ.` },
    { q: 'How many Tennessee homes heat with propane?', a: `${K.num(st.acs.propane)}, or ${K.pct(st.acs.propaneShare, 1)} of occupied homes, according to the Census Bureau's 2024 American Community Survey. Electricity heats ${K.num(st.acs.electric)} Tennessee homes and utility gas ${K.num(st.acs.gas)}. The EIA does not survey heating oil in the state, where fuel oil and kerosene heat ${K.num(st.acs.oil)} homes.` },
  ],
  related: ['propane-prices', 'propane-tank-fill-cost', 'heating-oil-vs-propane', 'state:kentucky', 'state:georgia', 'state:alabama'],
});
