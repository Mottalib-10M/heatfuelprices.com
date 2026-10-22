import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('MO');
const p = K.sum('MO', 'pr')!;
const pld = K.lastDone('MO', 'pr')!;
const galP = K.est(st, 'pr');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);
const gap = (c: string) => { const d = p.last[1] - K.price(c, 'pr')!; return `${K.ppg(Math.abs(d))} ${K.dir(d, 'dearer', 'cheaper', 'level')}`; };

export default defineState({
  slug: 'missouri',
  title: 'Missouri Propane Prices This Week, Winter 2026-27 Survey',
  description: `Missouri propane prices this week from the federal survey, winter 2026-27: price per gallon, the margin over wholesale, a fill, last winter and help with bills.`,
  intro: `Missouri propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}.`,
  resume: `Missouri splits its heating between utility gas and electricity, but ${K.num(st.acs.propane)} homes, ${K.pct(st.acs.propaneShare, 1)} of the total by the Census Bureau's 2024 count, rely on propane. Wood heats another ${K.num(st.acs.wood)}. In the EIA's weekly survey of ${K.day(p.last[0])}, Missouri propane averaged ${K.ppg(p.last[1])} a gallon, ${K.ord(K.place('MO', 'pr'))} of ${K.ranked('pr').length} states counting from the dearest and ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the national average. Last winter the Missouri average was ${K.ppg(pld.avg!)} from November to March. A normal Missouri winter counts ${K.num(st.hdd.winter)} heating degree days over those months, so the EIA's average Midwest propane home would burn about ${K.gal(galP)}, which is ${K.usd(galP * p.last[1])} at this week's price. Heating oil is not surveyed in Missouri. Prices exclude sales tax and delivery fees, and each dealer sets its own price around the state average.`,
  body: (h) => `
<h2>What the Missouri price is made of</h2>
<p>The EIA's wholesale propane price for Missouri this week is ${p.wholesale ? K.ppg(p.wholesale) : 'not published'}. ${K.spread('MO', 'pr') === null ? 'Without it the margin cannot be computed.' : `The residential average is ${K.ppg(K.spread('MO', 'pr')!)} above it, so roughly ${K.pct(K.spread('MO', 'pr')! / p.last[1], 0)} of each gallon pays for delivery, storage, the tank and the dealer.`} That share explains why the price at the house moves more slowly than the wholesale market, in both directions.</p>
${h.mini('fill', { t: 'Propane fill in Missouri', p: ['tank', 'gauge'], d: { st: 'MO', fuel: 'pr', tank: 500, gauge: 20 }, c: 'Open the tank fill calculator' })}
<h2>The record in Missouri</h2>
<p>Last winter the Missouri average ran from ${K.ppg(pld.min[1])} to ${K.ppg(pld.max[1])}, the high on ${K.day(pld.max[0])}. The highest week the survey has recorded in the state is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}. Since ${p.seasons[0].s}, the winter average ended above the mid-October price in ${rp.up} of ${rp.n} seasons, with a median change of ${K.pct(rp.median, 1)}. The ${h.a('lock-in-or-wait', 'lock-in check')} replays each of those winters against a fixed price you are offered.</p>
<h2>Missouri and its neighbors</h2>
<p>This week Missouri propane is ${gap('KS')} than Kansas's average, ${gap('IL')} than Illinois's, ${gap('AR')} than Arkansas's and ${gap('TN')} than Tennessee's. The ${h.a('propane-prices', 'propane table')} ranks all surveyed states every week.</p>
<h2>Propane, wood and the winter budget</h2>
<p>NOAA's normals give Missouri ${K.num(st.hdd.month['12'])} heating degree days in December, ${K.num(st.hdd.month['01'])} in January and ${K.num(st.hdd.month['02'])} in February. A home that burns some wood alongside propane uses fewer gallons than the EIA average; for such a home, last winter's delivery tickets are the better guide, and the ${h.a('winter-heating-budget', 'winter budget')} accepts them. Per million Btu at the ENERGY STAR furnace rating, Missouri propane heat costs ${K.usd(K.perMBtu({ price: p.last[1], btu: K.P.btu.propane, efficiency: K.P.efficiency.propane }))} this week; the ${h.a('heating-oil-vs-propane', 'comparison page')} sets it against an electric heat pump at the EIA's regional forecast rate.</p>
<h2>Help with heating costs</h2>
<p>The federal LIHEAP ceiling for a Missouri household of two is ${K.usd(K.liheap('MO', 2))} a year and for four ${K.usd(K.liheap('MO', 4))}. States may set their own limit below the federal ceiling; the ${h.a('liheap-income-limits', 'LIHEAP page')} explains how it is computed.</p>
`,
  faqs: [
    { q: 'What does propane cost in Missouri this week?', a: `For the week of ${K.day(p.last[0])}, dealers in Missouri averaged ${K.ppg(p.last[1])} per gallon in the EIA's count, before tax, next to ${K.ppg(K.price('US', 'pr')!)} nationwide. Taking a 500-gallon tank from 20 % to 80 % is a 300-gallon order, around ${K.usd(300 * p.last[1])}. Contracts and owned tanks shift individual quotes.` },
    { q: 'How many Missouri homes are heated with propane?', a: `The 2024 American Community Survey finds ${K.num(st.acs.propane)} Missouri households relying mainly on propane, which is ${K.pct(st.acs.propaneShare, 1)} of all occupied units. Gas utilities serve ${K.num(st.acs.gas)} homes, electric heat ${K.num(st.acs.electric)}, and ${K.num(st.acs.wood)} burn wood. With only ${K.num(st.acs.oil)} oil-heated homes, Missouri sits outside the federal heating oil survey.` },
    { q: 'How much propane will a Missouri home need this winter?', a: `Scale the EIA's Midwest propane household to Missouri's normal ${K.num(st.hdd.winter)} degree days between November and March and you get close to ${K.gal(galP)}, or ${K.usd(galP * p.last[1])} at the latest price. A bitter winter, a big farmhouse or gas appliances raise it; a wood stove lowers it.` },
  ],
  related: ['propane-tank-fill-cost', 'lock-in-or-wait', 'liheap-income-limits', 'state:kansas', 'state:illinois', 'state:arkansas'],
});
