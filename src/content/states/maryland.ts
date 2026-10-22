import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('MD');
const o = K.sum('MD', 'ho')!;
const p = K.sum('MD', 'pr')!;
const ld = K.lastDone('MD', 'ho')!;
const galO = K.est(st, 'ho');
const yo = K.yoy('MD', 'ho');
const yp = K.yoy('MD', 'pr');

export default defineState({
  slug: 'maryland',
  title: 'Maryland Heating Oil Prices This Week, Propane Too, 2026-27',
  description: `Maryland heating oil and propane prices this week from the federal survey, 2026-27: wholesale and retail side by side, change on a year and a winter's cost.`,
  intro: `Maryland heating oil averaged ${K.ppg(o.last[1])} a gallon in the EIA survey of ${K.day(o.last[0])}, propane ${K.ppg(p.last[1])}.`,
  resume: `Maryland heats mostly with electricity and utility gas, which together warm ${K.pct((st.acs.electric + st.acs.gas) / st.acs.homes, 0)} of its homes. Heating oil remains the main fuel in ${K.num(st.acs.oil)} homes and propane in ${K.num(st.acs.propane)}, according to the Census Bureau's 2024 survey. For them, the EIA's weekly survey of ${K.day(o.last[0])} gives ${K.ppg(o.last[1])} a gallon for heating oil, ${K.ord(K.place('MD', 'ho'))} of ${K.ranked('ho').length} states${yo === null ? '' : `, ${K.dir(yo, 'up', 'down')} ${K.pct(Math.abs(yo), 0)} on a year`}, and ${K.ppg(p.last[1])} for propane${yp === null ? '' : `, ${K.dir(yp, 'up', 'down')} ${K.pct(Math.abs(yp), 0)}`}. A normal Maryland winter counts ${K.num(st.hdd.winter)} heating degree days from November to March, so the EIA's average oil home would burn about ${K.gal(galO)}, ${K.usd(galO * o.last[1])} at this week's price. Last winter the state's oil averaged ${K.ppg(ld.avg!)} a gallon. All figures are averages of the prices reported by dealers, before sales tax and any delivery fee.`,
  body: (h) => `
<h2>Wholesale against retail in Maryland</h2>
<p>Maryland is one of the states where the EIA publishes a wholesale price for both heating fuels. This week wholesale heating oil was ${o.wholesale ? K.ppg(o.wholesale) : 'unpublished'} and wholesale propane ${p.wholesale ? K.ppg(p.wholesale) : 'unpublished'}. Set against the residential averages, that leaves ${K.spread('MD', 'ho') === null ? 'an unmeasured margin on oil' : `${K.ppg(K.spread('MD', 'ho')!)} a gallon on oil`} and ${K.spread('MD', 'pr') === null ? 'an unmeasured margin on propane' : `${K.ppg(K.spread('MD', 'pr')!)} on propane`}. In other words, ${K.spread('MD', 'pr') === null ? 'the propane margin cannot be computed this week' : `${K.pct(K.spread('MD', 'pr')! / p.last[1], 0)} of what a Maryland propane household pays goes to delivery, storage and the dealer`}, against ${K.spread('MD', 'ho') === null ? 'an unknown share' : K.pct(K.spread('MD', 'ho')! / o.last[1], 0)} for oil.</p>
${h.mini('price', { t: 'Maryland price and your order', p: ['fuel', 'gal'], d: { st: 'MD', fuel: 'pr', gal: 250 }, c: 'Open the price lookup' })}
<h2>The season in Maryland</h2>
<p>Last winter Maryland heating oil ran from ${K.ppg(ld.min[1])} to ${K.ppg(ld.max[1])}, its high on ${K.day(ld.max[0])}. The highest Maryland week since 2013 was ${K.ppg(o.record[1])}, and for propane ${K.ppg(p.record[1])}. This week oil is ${K.ppg(Math.abs(o.last[1] - K.price('VA', 'ho')!))} ${K.dir(o.last[1] - K.price('VA', 'ho')!, 'dearer', 'cheaper', 'level')} than in Virginia and ${K.ppg(Math.abs(o.last[1] - K.price('PA', 'ho')!))} ${K.dir(o.last[1] - K.price('PA', 'ho')!, 'dearer', 'cheaper', 'level')} than in Pennsylvania.</p>
<h2>Weather and the bill</h2>
<p>NOAA's normals for Maryland give ${K.num(st.hdd.month['12'])} heating degree days in December, ${K.num(st.hdd.month['01'])} in January and ${K.num(st.hdd.month['02'])} in February, weighted by where Marylanders live, so a house in a colder part of the state than the average will burn more. Your own delivery tickets reflect your own climate better than a state average, and the ${h.a('winter-heating-budget', 'winter budget')} accepts them. For a household deciding between a fixed price and the market, the ${h.a('lock-in-or-wait', 'lock-in check')} replays every Maryland winter since 2013-14.</p>
<h2>Help with the bill</h2>
<p>Federal LIHEAP rules set Maryland's income ceiling for a household of two at ${K.usd(K.liheap('MD', 2))} a year and for four at ${K.usd(K.liheap('MD', 4))}. The state can set a lower limit; the ${h.a('liheap-income-limits', 'LIHEAP page')} explains how the federal ceiling is computed.</p>
<h2>The next delivery</h2>
<p>A Maryland oil household with a 275-gallon tank at a quarter would take at most ${K.gal(275 * 0.75)}, ${K.usd(275 * 0.75 * o.last[1])} at this week's average if the dealer fills it to the brim; a propane household with a 500-gallon tank at 30 % would take 250 gallons, ${K.usd(250 * p.last[1])}. The ${h.a('heating-oil-tank-fill-cost', 'oil tank calculator')} and the ${h.a('propane-tank-fill-cost', 'propane tank calculator')} take your own tank and gauge, and add a delivery fee or a sales tax if you know them.</p>
`,
  faqs: [
    { q: 'What is the heating oil price in Maryland this week?', a: `${K.ppg(o.last[1])} a gallon on average in the EIA survey of ${K.day(o.last[0])}, excluding taxes, against a wholesale price of ${o.wholesale ? K.ppg(o.wholesale) : 'an unpublished level'} in the state. A 150-gallon delivery at the residential average comes to ${K.usd(150 * o.last[1])}. Prices from individual Maryland dealers vary around that figure.` },
    { q: 'How much of the Maryland propane price is the dealer margin?', a: `${K.spread('MD', 'pr') === null ? 'The EIA did not publish a Maryland wholesale propane price this week, so the margin cannot be measured from the survey.' : `About ${K.ppg(K.spread('MD', 'pr')!)} of the ${K.ppg(p.last[1])} residential average this week, the gap to the wholesale price of ${K.ppg(p.wholesale!)}.`} That margin covers trucks, storage, the tank and profit, and over a season it usually moves much less than the wholesale price does.` },
    { q: 'How many Maryland homes heat with oil or propane?', a: `The Census Bureau's 2024 American Community Survey counts ${K.num(st.acs.oil)} Maryland homes heated mainly with fuel oil or kerosene and ${K.num(st.acs.propane)} with propane, out of ${K.num(st.acs.homes)} occupied homes. Electricity, at ${K.num(st.acs.electric)} homes, is the most common heating fuel in the state.` },
  ],
  related: ['heating-oil-prices', 'lock-in-or-wait', 'liheap-income-limits', 'state:delaware', 'state:virginia', 'state:pennsylvania'],
});
