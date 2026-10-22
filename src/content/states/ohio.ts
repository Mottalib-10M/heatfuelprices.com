import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('OH');
const o = K.sum('OH', 'ho')!;
const p = K.sum('OH', 'pr')!;
const ld = K.lastDone('OH', 'ho')!;
const pld = K.lastDone('OH', 'pr')!;
const galP = K.est(st, 'pr'), galO = K.est(st, 'ho');
const yp = K.yoy('OH', 'pr');

export default defineState({
  slug: 'ohio',
  title: 'Ohio Propane and Heating Oil Prices This Week, 2026-27',
  description: `Ohio propane and heating oil prices from the federal weekly survey, 2026-27: the dealer margin, a fill of either fuel, last winter's prices, a season's cost.`,
  intro: `Ohio propane averaged ${K.ppg(p.last[1])} a gallon and heating oil ${K.ppg(o.last[1])} in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Ohio is a gas state: utility gas heats ${K.pct(st.acs.gas / st.acs.homes, 0)} of its homes. But the Census Bureau's 2024 survey still counts ${K.num(st.acs.propane)} Ohio homes on propane and ${K.num(st.acs.oil)} on fuel oil or kerosene, and for them the weekly federal survey is the reference price. In the week of ${K.day(p.last[0])}, Ohio propane averaged ${K.ppg(p.last[1])} a gallon, ${K.ord(K.place('OH', 'pr'))} of ${K.ranked('pr').length} states from the dearest${yp === null ? '' : `, and ${K.pct(Math.abs(yp), 0)} ${K.dir(yp, 'above', 'below')} its level a year earlier`}. Heating oil averaged ${K.ppg(o.last[1])}, ${K.ord(K.place('OH', 'ho'))} of ${K.ranked('ho').length}. Ohio's normal winter counts ${K.num(st.hdd.winter)} heating degree days from November to March; on that weather the EIA's average Midwest propane home would burn about ${K.gal(galP)}, ${K.usd(galP * p.last[1])} at this week's price, and the average oil home about ${K.gal(galO)}, ${K.usd(galO * o.last[1])}. All prices are before tax.`,
  body: (h) => `
<h2>Propane in Ohio</h2>
<p>Last winter Ohio propane averaged ${K.ppg(pld.avg!)} a gallon from November to March, ranging from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}. The highest week the survey has recorded in Ohio is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}. The EIA's wholesale price for the state this week is ${p.wholesale ? K.ppg(p.wholesale) : 'unpublished'}, so ${K.spread('OH', 'pr') === null ? 'the margin cannot be measured' : `delivery, storage and the dealer account for ${K.ppg(K.spread('OH', 'pr')!)} of every gallon`}. Filling a 500-gallon tank from 30 % to 80 % costs ${K.usd(250 * p.last[1])} at the average.</p>
${h.mini('fill', { t: 'Propane fill in Ohio', p: ['tank', 'gauge'], d: { st: 'OH', fuel: 'pr', tank: 500, gauge: 30 }, c: 'Open the tank fill calculator' })}
<h2>Heating oil in Ohio</h2>
<p>Ohio's heating oil households paid ${K.ppg(ld.avg!)} a gallon on average last winter, between ${K.ppg(ld.min[1])} and ${K.ppg(ld.max[1])}. This week's average of ${K.ppg(o.last[1])} is ${K.ppg(Math.abs(o.last[1] - K.price('PA', 'ho')!))} ${K.dir(o.last[1] - K.price('PA', 'ho')!, 'above', 'below', 'level with')} Pennsylvania's and ${K.ppg(Math.abs(o.last[1] - K.price('MI', 'ho')!))} ${K.dir(o.last[1] - K.price('MI', 'ho')!, 'above', 'below', 'level with')} Michigan's. The wholesale figure for Ohio, ${o.wholesale ? K.ppg(o.wholesale) : 'unpublished'}, leaves a dealer spread of ${K.spread('OH', 'ho') === null ? 'unknown size' : K.ppg(K.spread('OH', 'ho')!)}. A 275-gallon tank at a quarter takes up to ${K.gal(275 * 0.75)}, ${K.usd(275 * 0.75 * o.last[1])} at the average; the ${h.a('heating-oil-tank-fill-cost', 'oil tank calculator')} takes your own gauge.</p>
<h2>Which fuel gives cheaper heat</h2>
<p>A gallon of propane holds ${K.num(K.P.btu.propane)} Btu and a gallon of heating oil ${K.num(K.P.btu.oil)}, according to the EIA. At ENERGY STAR efficiencies and this week's Ohio averages, a million Btu of delivered heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} from propane and ${K.usd(K.perMBtu({ price: o.last[1], btu: K.P.btu.oil, efficiency: K.P.efficiency.oil }))} from oil. The ${h.a('heating-oil-vs-propane', 'comparison page')} puts an electric heat pump on the same basis.</p>
<h2>An Ohio winter</h2>
<p>NOAA's normals give Ohio ${K.num(st.hdd.month['12'])} heating degree days in December, ${K.num(st.hdd.month['01'])} in January and ${K.num(st.hdd.month['02'])} in February, weighted by population. Those months carry ${K.pct((st.hdd.month['12'] + st.hdd.month['01'] + st.hdd.month['02']) / st.hdd.winter, 0)} of the November to March total. The ${h.a('winter-heating-budget', 'winter budget')} spreads the season month by month at this week's price, and the ${h.a('liheap-income-limits', 'LIHEAP page')} gives the federal income ceiling for heating help in Ohio: ${K.usd(K.liheap('OH', 4))} a year for a family of four.</p>
<h2>Fixed price or market price</h2>
<p>Ohio dealers, like dealers elsewhere, may offer propane at a fixed or capped price for the season, sometimes against a pre-payment or a minimum volume. The record since ${p.seasons[0].s} shows how the Ohio winter average compared with the mid-October price each year; the ${h.a('lock-in-or-wait', 'lock-in check')} replays those winters against the price you are offered and the gallons you expect to buy, and says how many of them a lock would have won.</p>
`,
  faqs: [
    { q: 'What is the propane price in Ohio this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes, against ${K.ppg(K.price('US', 'pr')!)} nationally. At that average a 250-gallon fill costs ${K.usd(250 * p.last[1])}. Dealers' own prices vary with contracts, tank ownership and the size of the delivery.` },
    { q: 'How much does heating oil cost in Ohio?', a: `The EIA's weekly survey put Ohio heating oil at ${K.ppg(o.last[1])} a gallon in the week of ${K.day(o.last[0])}, excluding taxes. Last winter the state averaged ${K.ppg(ld.avg!)} from November to March. A 150-gallon delivery at this week's average comes to ${K.usd(150 * o.last[1])}.` },
    { q: 'How many Ohio homes use propane or oil for heat?', a: `The Census Bureau's 2024 American Community Survey counts ${K.num(st.acs.propane)} Ohio homes heated mainly with propane and ${K.num(st.acs.oil)} with fuel oil or kerosene, out of ${K.num(st.acs.homes)} occupied homes. Utility gas, at ${K.num(st.acs.gas)} homes, is the most common heating fuel in the state.` },
  ],
  related: ['heating-oil-vs-propane', 'propane-tank-fill-cost', 'heating-oil-tank-fill-cost', 'state:pennsylvania', 'state:michigan', 'state:indiana'],
});
