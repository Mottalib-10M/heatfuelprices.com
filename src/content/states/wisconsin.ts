import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.SC('WI');
const o = K.sum('WI', 'ho')!;
const p = K.sum('WI', 'pr')!;
const pld = K.lastDone('WI', 'pr')!;
const galP = K.est(st, 'pr');
const rp = K.replay(p.seasons.filter((x) => x.s !== p.season), p.last[1]);
const prDone = p.seasons.filter((x) => x.avg);

export default defineState({
  slug: 'wisconsin',
  title: 'Wisconsin Propane Prices This Week, and Heating Oil, 2026-27',
  description: `Wisconsin propane prices this week from the federal survey, winter 2026-27, with heating oil: one home in nine on propane, the cost of a fill and past winters.`,
  intro: `Wisconsin propane averaged ${K.ppg(p.last[1])} a gallon in the EIA survey of ${K.day(p.last[0])}; heating oil ${K.ppg(o.last[1])}.`,
  resume: `Wisconsin counts ${K.num(st.acs.propane)} homes heated mainly with propane, ${K.pct(st.acs.propaneShare, 1)} of occupied homes by the Census Bureau's 2024 survey, and ${K.num(st.acs.oil)} with fuel oil or kerosene. Its winter is among the longest in the country, ${K.num(st.hdd.winter)} heating degree days from November to March in a normal year, which makes the gallons count as much as the price. In the EIA's weekly survey of ${K.day(p.last[0])}, Wisconsin propane averaged ${K.ppg(p.last[1])} a gallon, ${K.ord(K.place('WI', 'pr'))} of ${K.ranked('pr').length} states from the dearest and ${K.ppg(Math.abs(p.last[1] - K.price('US', 'pr')!))} ${K.dir(p.last[1] - K.price('US', 'pr')!, 'above', 'below', 'level with')} the U.S. average. Heating oil averaged ${K.ppg(o.last[1])}. The EIA's average Midwest propane home, scaled to Wisconsin's weather, would burn about ${K.gal(galP)} over the winter, ${K.usd(galP * p.last[1])} at this week's average. These are survey averages before sales tax and delivery fees; a dealer's own price may differ.`,
  body: (h) => `
<h2>Every propane winter on file</h2>
${h.table(['Winter', 'Mid-October', 'Nov-Mar average', 'Highest week'], prDone.slice(-6).reverse().map((x) => [x.s, x.oct ? K.ppg(x.oct) : 'n/a', K.ppg(x.avg!), K.ppg(x.max[1])]), 'EIA weekly survey, Wisconsin residential propane, dollars per gallon excluding taxes. Last six complete winters.', ['l', 'r', 'r', 'r'])}
<p>Last winter Wisconsin propane averaged ${K.ppg(pld.avg!)}, with a high week of ${K.ppg(pld.max[1])} on ${K.day(pld.max[0])}. Across the seasons since ${p.seasons[0].s}, the November to March average ended above the mid-October price in ${rp.up} of ${rp.n} winters. The record week is ${K.ppg(p.record[1])}, on ${K.day(p.record[0])}.</p>
${h.mini('lockin', { t: 'A Wisconsin pre-buy offer', p: ['fixed', 'gal'], d: { st: 'WI', fuel: 'pr' }, c: 'Open the lock-in check' })}
<h2>What a fill costs</h2>
<p>A 500-gallon tank filled from 30 % to the 80 % level commonly used for propane takes 250 gallons, ${K.usd(250 * p.last[1])} at this week's Wisconsin average. A 1,000-gallon tank from 20 % takes 600 gallons, ${K.usd(600 * p.last[1])}. The EIA's wholesale propane price for Wisconsin is ${p.wholesale ? K.ppg(p.wholesale) : 'unpublished this week'}, so ${K.spread('WI', 'pr') === null ? 'the dealer margin cannot be measured' : `${K.ppg(K.spread('WI', 'pr')!)} of each gallon goes to delivery, storage and the dealer`}. The ${h.a('propane-tank-fill-cost', 'propane tank calculator')} takes your own tank, gauge and any delivery fee.</p>
<h2>Wisconsin against its neighbors</h2>
<p>This week Wisconsin propane is ${K.ppg(Math.abs(p.last[1] - K.price('MN', 'pr')!))} ${K.dir(p.last[1] - K.price('MN', 'pr')!, 'dearer', 'cheaper', 'level')} than in Minnesota, ${K.ppg(Math.abs(p.last[1] - K.price('MI', 'pr')!))} ${K.dir(p.last[1] - K.price('MI', 'pr')!, 'dearer', 'cheaper', 'level')} than in Michigan and ${K.ppg(Math.abs(p.last[1] - K.price('IL', 'pr')!))} ${K.dir(p.last[1] - K.price('IL', 'pr')!, 'dearer', 'cheaper', 'level')} than in Illinois. Wisconsin heating oil, at ${K.ppg(o.last[1])}, is ${K.ppg(Math.abs(o.last[1] - K.price('MI', 'ho')!))} ${K.dir(o.last[1] - K.price('MI', 'ho')!, 'dearer', 'cheaper', 'level')} than Michigan's.</p>
<h2>The winter month by month</h2>
<p>NOAA's normals give Wisconsin ${K.num(st.hdd.month['12'])} heating degree days in December, ${K.num(st.hdd.month['01'])} in January and ${K.num(st.hdd.month['02'])} in February. By the same scaling as the season estimate, the average propane home burns about ${K.gal(galP * st.hdd.month['01'] / st.hdd.winter)} in January alone. The ${h.a('winter-heating-budget', 'winter budget')} spreads the season month by month, and the ${h.a('liheap-income-limits', 'LIHEAP page')} gives the federal income ceiling for heating help, ${K.usd(K.liheap('WI', 3))} a year for three people in Wisconsin.</p>
<h2>Planning the season</h2>
<p>Propane tanks are usually filled to about 80 %, so a 500-gallon tank holds some 400 gallons at the start of the season. Against the ${K.gal(galP)} the average Wisconsin propane home burns from November to March, that is about ${K.dec(galP / 400, 1)} tanks over the winter, before cooking, hot water and the shoulder months. A household on automatic delivery leaves the timing to the dealer; one that calls for its own deliveries should watch the gauge from December, when the colder months begin. The ${h.a('how-long-will-my-oil-last', 'days-left calculator')} turns a gauge reading into a date, using Wisconsin's monthly normals.</p>
`,
  faqs: [
    { q: 'What do Wisconsin households pay for propane this week?', a: `${K.ppg(p.last[1])} a gallon on average in the EIA survey of ${K.day(p.last[0])}, excluding taxes. At that price, a 500-gallon tank filled from 30 % to 80 % costs ${K.usd(250 * p.last[1])}. Dealers in Wisconsin often offer pre-buy or budget plans whose price can differ from the weekly average.` },
    { q: 'Was propane cheaper in Wisconsin last winter?', a: `Last winter the Wisconsin average from November to March was ${K.ppg(pld.avg!)} a gallon, against ${K.ppg(p.last[1])} in the survey this week. A 250-gallon fill would have cost ${K.usd(250 * pld.avg!)} at last winter's average and costs ${K.usd(250 * p.last[1])} now. Prices exclude taxes in both cases.` },
    { q: 'How many Wisconsin homes heat with propane?', a: `${K.num(st.acs.propane)}, or ${K.pct(st.acs.propaneShare, 1)} of occupied homes, according to the Census Bureau's 2024 American Community Survey. Utility gas heats ${K.num(st.acs.gas)} homes and electricity ${K.num(st.acs.electric)}. Wood, at ${K.num(st.acs.wood)} homes, ranks ${K.ord(K.rankOf('WI', (x) => x.acs.wood / x.acs.homes))} among the surveyed states for its share of homes heated mainly with wood.` },
  ],
  related: ['lock-in-or-wait', 'propane-tank-fill-cost', 'propane-prices', 'state:minnesota', 'state:michigan', 'state:illinois'],
});
