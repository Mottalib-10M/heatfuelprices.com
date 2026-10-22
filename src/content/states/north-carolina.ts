import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('NC');
const o = K.sum('NC', 'ho')!;
const p = K.sum('NC', 'pr')!;
const pld = K.lastDone('NC', 'pr')!;
const galO = K.est(st, 'ho'), galP = K.est(st, 'pr');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);

export default defineState({
  slug: 'north-carolina',
  title: 'North Carolina Propane and Heating Oil Prices, 2026-27',
  description: `North Carolina propane and heating oil prices this week from the federal survey, 2026-27: tank fill costs, the dealer margin and a southern winter's bill.`,
  intro: `North Carolina propane averaged ${K.ppg(p.last[1])} a gallon and heating oil ${K.ppg(o.last[1])} in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `In North Carolina two homes in three heat with electricity, but propane and oil still heat ${K.num(st.acs.propane + st.acs.oil)} homes between them. The Census Bureau's 2024 survey counts ${K.num(st.acs.propane)} homes heated mainly with propane and ${K.num(st.acs.oil)} with fuel oil or kerosene, ${K.pct(st.acs.propaneShare, 1)} and ${K.pct(st.acs.oilShare, 1)} of occupied homes. In the EIA's weekly survey of ${K.day(p.last[0])}, North Carolina propane averaged ${K.ppg(p.last[1])} a gallon, ${K.ord(K.place('NC', 'pr'))} of ${K.ranked('pr').length} states, and heating oil ${K.ppg(o.last[1])}, ${K.ord(K.place('NC', 'ho'))} of ${K.ranked('ho').length}. A normal winter here counts only ${K.num(st.hdd.winter)} heating degree days from November to March, so the EIA's average propane home would burn about ${K.gal(galP)} and the average oil home about ${K.gal(galO)}, which is ${K.usd(galP * p.last[1])} and ${K.usd(galO * o.last[1])} at this week's prices. Prices exclude taxes, and the dealer's own price is the one on the bill.`,
  body: (h) => `
<h2>Propane: where the money goes</h2>
<p>The EIA publishes a wholesale propane price for North Carolina, ${p.wholesale ? K.ppg(p.wholesale) : 'not available this week'}. Against the residential average of ${K.ppg(p.last[1])}, ${K.spread('NC', 'pr') === null ? 'the margin cannot be measured this week' : `that leaves ${K.ppg(K.spread('NC', 'pr')!)} a gallon, ${K.pct(K.spread('NC', 'pr')! / p.last[1], 0)} of the price, for delivery, storage, the tank and the dealer`}. That is why the price at the house moves much less than the wholesale market from week to week.</p>
<p>Last winter North Carolina propane averaged ${K.ppg(pld.avg!)} from November to March, with a low of ${K.ppg(pld.min[1])} and a high of ${K.ppg(pld.max[1])}. Over the seasons since 2013-14, the winter average ended above the mid-October price in ${rp.up} of ${rp.n} cases. The ${h.a('lock-in-or-wait', 'lock-in check')} runs a dealer's fixed price against each of those winters.</p>
${h.mini('fill', { t: 'Propane fill in North Carolina', p: ['tank', 'gauge'], d: { st: 'NC', fuel: 'pr', tank: 500, gauge: 20 }, c: 'Open the tank fill calculator' })}
<h2>Heating oil in North Carolina</h2>
<p>North Carolina's heating oil average this week, ${K.ppg(o.last[1])}, sits ${K.ppg(Math.abs(o.last[1] - K.price('US', 'ho')!))} ${K.dir(o.last[1] - K.price('US', 'ho')!, 'above', 'below', 'level with')} the national figure and ${K.ppg(Math.abs(o.last[1] - K.price('VA', 'ho')!))} ${K.dir(o.last[1] - K.price('VA', 'ho')!, 'above', 'below', 'level with')} Virginia's. The wholesale price the EIA reports for the state, ${o.wholesale ? K.ppg(o.wholesale) : 'unpublished'}, leaves a dealer spread of ${K.spread('NC', 'ho') === null ? 'unknown size' : K.ppg(K.spread('NC', 'ho')!)}.</p>
<h2>A short winter, a smaller tank</h2>
<p>NOAA's normals give North Carolina ${K.num(st.hdd.month['01'])} heating degree days in January, about ${K.pct(st.hdd.month['01'] / K.SC('ME').hdd.month['01'], 0)} of a Maine January, and ${K.num(st.hdd.month['03'])} in March. A household that heats with propane may also cook, dry clothes or heat water with it, and those uses go on all year: the winter estimate covers heating only. The ${h.a('winter-heating-budget', 'winter budget')} lets you enter the gallons you actually bought last year, and the ${h.a('heating-oil-vs-propane', 'comparison page')} sets propane against an electric heat pump per million Btu for a household thinking of switching. The federal LIHEAP ceiling for three people in North Carolina is ${K.usd(K.liheap('NC', 3))} a year.</p>
<h2>North Carolina against its neighbors</h2>
<p>This week North Carolina propane is ${K.ppg(Math.abs(p.last[1] - K.price('VA', 'pr')!))} ${K.dir(p.last[1] - K.price('VA', 'pr')!, 'dearer', 'cheaper', 'level')} than Virginia's average, ${K.ppg(Math.abs(p.last[1] - K.price('TN', 'pr')!))} ${K.dir(p.last[1] - K.price('TN', 'pr')!, 'dearer', 'cheaper', 'level')} than Tennessee's and ${K.ppg(Math.abs(p.last[1] - K.price('GA', 'pr')!))} ${K.dir(p.last[1] - K.price('GA', 'pr')!, 'dearer', 'cheaper', 'level')} than Georgia's. Those gaps are state averages: a household near a state line may find dealers on either side, and two dealers in the same county can also quote different prices, so it pays to ask more than one. The ${h.a('propane-prices', 'propane price table')} ranks all ${K.ranked('pr').length} surveyed states each Wednesday.</p>
`,
  faqs: [
    { q: 'What does propane cost in North Carolina this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} nationally. Filling a 500-gallon tank from 20 % to 80 % takes 300 gallons, ${K.usd(300 * p.last[1])} at that average. A dealer who leases you the tank sets the price of each fill.` },
    { q: 'How much propane does a North Carolina home use in a winter?', a: `The EIA's average propane-heated home in the South, scaled to North Carolina's ${K.num(st.hdd.winter)} heating degree days from November to March, burns about ${K.gal(galP)} for heat. Cooking, hot water and a clothes dryer add to that over the year. Your own delivery tickets are the best guide for your house.` },
    { q: 'Is heating oil still sold in North Carolina?', a: `Yes. The EIA surveys North Carolina heating oil dealers every week from October to March, and the average this week is ${K.ppg(o.last[1])} a gallon before tax. The Census Bureau counts ${K.num(st.acs.oil)} homes in the state heated mainly with fuel oil or kerosene, a small share of the total.` },
  ],
  related: ['propane-tank-fill-cost', 'propane-prices', 'lock-in-or-wait', 'state:virginia', 'state:georgia', 'state:tennessee'],
});
